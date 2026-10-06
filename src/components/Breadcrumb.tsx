import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    ...items
  ];

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className={`py-2 px-1 text-xs text-slate-400 flex items-center flex-wrap gap-1.5 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" aria-hidden="true" />
              )}
              {isLast || !item.url ? (
                <span 
                  className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {index === 0 && <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-electric-blue transition-colors flex items-center"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5 mr-1" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl = 'https://www.mechafyglobal.com') {
  const allItems = [{ name: 'Home', url: '/' }, ...items];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? (item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`) : undefined,
    })),
  };
}
