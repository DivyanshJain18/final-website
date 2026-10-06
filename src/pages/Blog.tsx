import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogArticles';
import { Search, BookOpen, Clock, Calendar, ArrowRight, Tag, Sparkles, Filter } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Breadcrumb } from '../components/Breadcrumb';

const CATEGORIES = ['All', '3D Printing', 'PC Hardware', 'Robotics & Electronics'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = BLOG_ARTICLES[0];

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Mechafy Global Knowledge Base & Hardware Guides",
    "description": "Expert technical guides, hardware comparisons, and tutorials on 3D printing, robotics, and PC performance.",
    "url": "https://www.mechafyglobal.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Mechafy Global",
      "logo": {
        "@type": "ImageObject",
        "url": "https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg"
      }
    },
    "blogPost": BLOG_ARTICLES.map(a => ({
      "@type": "BlogPosting",
      "headline": a.title,
      "description": a.excerpt,
      "datePublished": a.date,
      "url": `https://www.mechafyglobal.com/blog/${a.slug}`,
      "image": a.coverImage,
      "author": {
        "@type": "Person",
        "name": a.author.name
      }
    }))
  };

  return (
    <Layout>
      <SEO 
        title="Engineering Guides & Hardware Tutorials | Knowledge Base"
        description="Master 3D printing, PC hardware architecture, microcontrollers & robotics. In-depth buyer guides, benchmarks, and step-by-step tutorials from Mechafy Global."
        canonicalPath="/blog"
        keywords={['Hardware guides', '3D printing tutorial', 'GPU comparison 1080p', 'DDR4 vs DDR5', 'PLA vs PETG', 'Arduino vs ESP32']}
        structuredData={blogSchema}
      />

      <div className="mb-4">
        <Breadcrumb items={[{ name: 'Knowledge & Guides' }]} />
      </div>

      {/* Hero Header */}
      <section className="relative glass-panel rounded-3xl overflow-hidden p-8 sm:p-12 mb-12 border border-white/10 bg-gradient-to-br from-navy-950/90 via-navy-900/80 to-navy-950/95">
        <div className="absolute top-0 right-0 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-electric-blue/15 text-electric-blue border border-electric-blue/30 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Engineering Guides & Knowledge Base</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Hardware Insights, Comparisons <span className="text-electric-blue">& Tutorials</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              Master robotics, additive 3D manufacturing, and PC component architecture with in-depth benchmarks, wiring diagrams, and curated hardware recommendations.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, GPUs, 3D printers, filaments, Arduino vs ESP32..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue backdrop-blur-md shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 custom-scrollbar">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === category
                ? 'bg-electric-blue text-navy-950 shadow-md font-bold'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Guide Banner (when no active search and 'All' category) */}
      {!searchQuery && selectedCategory === 'All' && featuredArticle && (
        <Reveal>
          <div className="mb-12 rounded-3xl overflow-hidden glass-card border border-white/15 hover:border-electric-blue/50 transition-all duration-300 group bg-navy-950/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured Guide
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-electric-blue transition-colors">
                    <Link to={`/blog/${featuredArticle.slug}`}>
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <img 
                      src={featuredArticle.author.avatar} 
                      alt={featuredArticle.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/15"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{featuredArticle.author.name}</div>
                      <div className="text-[11px] text-slate-400">{featuredArticle.author.role}</div>
                    </div>
                  </div>

                  <Link 
                    to={`/blog/${featuredArticle.slug}`}
                    className="btn-glow px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-video lg:aspect-auto min-h-[240px]">
                <img 
                  src={featuredArticle.coverImage} 
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Articles Grid */}
      <section aria-label="Knowledge Base Articles">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No articles found</h3>
            <p className="text-slate-400 text-sm mb-4">
              Try adjusting your search terms or selecting another category.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-4 py-2 rounded-xl bg-electric-blue text-navy-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, idx) => (
              <Reveal key={article.slug} delay={idx * 0.05}>
                <article className="group h-full flex flex-col glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-electric-blue/40 transition-all duration-300 hover:shadow-xl bg-navy-950/70">
                  {/* Article Thumbnail */}
                  <Link to={`/blog/${article.slug}`} className="relative aspect-video overflow-hidden bg-navy-900 block">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-navy-950/80 text-electric-blue border border-white/10">
                      {article.category}
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-electric-blue transition-colors line-clamp-2">
                      <Link to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4 flex-1">
                      {article.excerpt}
                    </p>

                    {/* Author & CTA */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                      <div className="text-xs text-slate-400">
                        By <strong className="text-white font-medium">{article.author.name}</strong>
                      </div>

                      <Link
                        to={`/blog/${article.slug}`}
                        className="text-xs font-bold text-electric-blue hover:text-cyan-400 flex items-center gap-1 group/link"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Engineering Support CTA */}
      <section className="mt-16 p-8 sm:p-10 rounded-3xl glass-panel border border-electric-blue/30 bg-gradient-to-r from-navy-950 via-blue-950/40 to-navy-950 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Have a Complex Robotics or Engineering Challenge?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Our hardware engineers and custom IT software architects help universities, makers, and B2B enterprises design custom robotics prototypes and production pipelines.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link to="/contact" className="btn-glow px-6 py-3 rounded-xl font-bold text-sm text-white">
            Ask a Specialist
          </Link>
          <Link to="/it-services" className="btn-secondary px-6 py-3 rounded-xl font-bold text-sm text-white">
            Explore IT Services
          </Link>
        </div>
      </section>
    </Layout>
  );
}
