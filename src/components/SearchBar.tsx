import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight, Tag, Box, AlertCircle } from 'lucide-react';
import { Product, fetchAllProductsEnriched } from '../services/productService';
import { executeSearch, tokenizeQuery } from '../services/searchService';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSearchSubmit?: (query: string) => void;
  compact?: boolean;
  onCloseMobile?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  placeholder = 'Search by name, SKU, brand, model, or category...',
  className = '',
  autoFocus = false,
  onSearchSubmit,
  compact = false,
  onCloseMobile
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRequestIdRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state if initialQuery changes
  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debouncing and race-condition prevention
  const performSearch = useCallback(async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSuggestions([]);
      setTotalCount(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    const currentRequestId = ++activeRequestIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const allProducts = await fetchAllProductsEnriched();
      
      // Check if this request is still relevant
      if (currentRequestId !== activeRequestIdRef.current) return;

      const { results, totalMatches } = executeSearch(allProducts, trimmed);
      
      // Limit suggestions to top 6 items
      setSuggestions(results.slice(0, 6));
      setTotalCount(totalMatches);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (err: any) {
      if (currentRequestId === activeRequestIdRef.current) {
        console.error('Search error:', err);
        setError('Failed to fetch suggestions');
        setSuggestions([]);
      }
    } finally {
      if (currentRequestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!newQuery.trim()) {
      setSuggestions([]);
      setTotalCount(0);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, 250);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setTotalCount(0);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const executeSubmit = (targetQuery?: string) => {
    const finalQuery = (targetQuery !== undefined ? targetQuery : query).trim();
    setIsOpen(false);
    setSelectedIndex(-1);

    if (onCloseMobile) {
      onCloseMobile();
    }

    if (onSearchSubmit) {
      onSearchSubmit(finalQuery);
    } else {
      if (finalQuery) {
        navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
      } else {
        navigate('/shop');
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const item = suggestions[selectedIndex];
      setIsOpen(false);
      if (onCloseMobile) onCloseMobile();
      navigate(`/product/${item.slug}`);
    } else {
      executeSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || (suggestions.length === 0 && !isLoading)) {
      if (e.key === 'Enter') {
        executeSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const item = suggestions[selectedIndex];
          setIsOpen(false);
          if (onCloseMobile) onCloseMobile();
          navigate(`/product/${item.slug}`);
        } else {
          executeSubmit();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Safe highlighted text helper
  const renderHighlightedName = (name: string, searchQuery: string) => {
    const tokens = tokenizeQuery(searchQuery);
    if (tokens.length === 0) return <span>{name}</span>;

    // Build regex for all tokens
    const escapedTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
    const parts = name.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-electric-blue/30 text-white font-bold rounded-xs px-0.5">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <div className="relative flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length > 0) {
                if (suggestions.length > 0) {
                  setIsOpen(true);
                } else {
                  performSearch(query);
                }
              }
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck="false"
            aria-label="Search products"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            className={`w-full rounded-xl bg-navy-950/80 backdrop-blur-md border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all shadow-inner ${
              compact ? 'pl-9 pr-16 py-2 text-xs md:text-sm' : 'pl-11 pr-20 py-2.5 text-sm md:text-base'
            }`}
          />

          {/* Left search icon */}
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} animate-spin text-electric-blue`} />
            ) : (
              <Search className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-slate-400`} />
            )}
          </div>

          {/* Right action buttons: Clear & Submit */}
          <div className="absolute right-2 flex items-center space-x-1">
            {query.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search query"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              >
                <X className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              </button>
            )}

            <button
              type="submit"
              aria-label="Submit search"
              className={`rounded-lg bg-electric-blue/15 hover:bg-electric-blue/30 text-electric-blue hover:text-white border border-electric-blue/30 transition-all font-medium flex items-center justify-center ${
                compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1 text-xs'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {error && (
            <div className="p-4 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/10 flex justify-between items-center">
                <span>Products ({totalCount})</span>
                <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">Use ↑↓ to navigate, Enter to select</span>
              </div>

              <ul role="listbox" className="divide-y divide-white/5 max-h-[380px] overflow-y-auto">
                {suggestions.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <li
                      key={item.id || item.slug}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        setIsOpen(false);
                        if (onCloseMobile) onCloseMobile();
                        navigate(`/product/${item.slug}`);
                      }}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-electric-blue/15 border-l-4 border-electric-blue' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-navy-900 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Fallback on image error
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Box className="w-6 h-6 text-slate-500" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 text-electric-blue border border-white/10">
                            {item.category_name || 'Component'}
                          </span>
                          {(item.brand || item.model) && (
                            <span className="text-[10px] text-slate-400 truncate">
                              {[item.brand, item.model].filter(Boolean).join(' ')}
                            </span>
                          )}
                          {item.sku && (
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              SKU: {item.sku}
                            </span>
                          )}
                        </div>

                        <div className="text-sm font-semibold text-white truncate">
                          {renderHighlightedName(item.name, query)}
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-white">₹{item.price.toFixed(2)}</span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-[10px] line-through text-slate-500">
                              ₹{item.originalPrice.toFixed(2)}
                            </span>
                          )}

                          {item.stock > 0 ? (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>
                              In Stock ({item.stock})
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-400 font-medium flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1"></span>
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 opacity-60 group-hover:opacity-100 shrink-0" />
                    </li>
                  );
                })}
              </ul>

              {/* View all results footer */}
              <div className="p-2 border-t border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => executeSubmit()}
                  className="w-full py-2 px-3 rounded-xl bg-electric-blue/20 hover:bg-electric-blue text-electric-blue hover:text-navy-950 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>View all {totalCount} results for "{query.trim()}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-white/5 mx-auto mb-2 flex items-center justify-center text-slate-500 border border-white/10">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">No products found</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                We couldn't find any products matching "{query.trim()}". Try searching for brand names, model numbers, or general categories.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Motors', 'Sensors', 'Processors', 'Memory', '3D Printers', 'Robotics'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                      performSearch(tag);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-electric-blue/20 hover:text-electric-blue text-slate-300 border border-white/10 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-electric-blue" />
              <span>Searching catalogue...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
