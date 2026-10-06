import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { getArticleBySlug, BLOG_ARTICLES } from '../data/blogArticles';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, Clock, Calendar, Share2, Check, Copy, ShoppingCart, 
  HelpCircle, ChevronRight, Bookmark, ArrowRight, Zap, ExternalLink 
} from 'lucide-react';
import { FaWhatsapp, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { SEO } from '../components/SEO';
import { Breadcrumb, generateBreadcrumbSchema } from '../components/Breadcrumb';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const article = getArticleBySlug(slug || '');

  if (!article) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-20 text-center glass-panel rounded-3xl p-8 my-8">
          <HelpCircle className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Article Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">
            The guide or tutorial you requested may have moved or been updated.
          </p>
          <Link to="/blog" className="btn-glow px-6 py-2.5 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Knowledge Base</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.slug,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      sku: item.slug
    }, 1);

    setAddedMap(prev => ({ ...prev, [item.slug]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [item.slug]: false }));
    }, 2000);
  };

  // Structured Data Schema for Google SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.coverImage],
    "datePublished": article.date,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mechafy Global",
      "logo": {
        "@type": "ImageObject",
        "url": "https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.mechafyglobal.com/blog/${article.slug}`
    }
  };

  const faqSchema = article.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  const otherArticles = BLOG_ARTICLES.filter(a => a.slug !== article.slug).slice(0, 3);

  const breadcrumbs = [
    { name: 'Knowledge Base', url: '/blog' },
    { name: article.category, url: `/blog?category=${encodeURIComponent(article.category)}` },
    { name: article.title }
  ];

  const combinedStructuredData = [
    articleSchema,
    generateBreadcrumbSchema(breadcrumbs),
    ...(faqSchema ? [faqSchema] : [])
  ];

  return (
    <Layout>
      <SEO 
        title={`${article.title} | Hardware Guide`}
        description={article.excerpt}
        canonicalPath={`/blog/${article.slug}`}
        type="article"
        image={article.coverImage}
        keywords={[article.category, ...article.tags, 'Mechafy Global', 'Hardware Guide']}
        structuredData={combinedStructuredData}
      />

      <article className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Back button */}
        <Link 
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-electric-blue/15 text-electric-blue border border-electric-blue/30">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-6">
            {article.subtitle}
          </p>

          {/* Author and Social Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-white/10">
            <div className="flex items-center gap-3">
              <img 
                src={article.author.avatar} 
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border border-white/20"
              />
              <div>
                <div className="text-sm font-bold text-white">{article.author.name}</div>
                <div className="text-xs text-slate-400">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" />
                Share:
              </span>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                aria-label="Copy article link"
                title="Copy link to clipboard"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - Read more on Mechafy Global: ` + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share via WhatsApp"
                title="Share via WhatsApp"
                className="p-2 rounded-xl bg-white/5 hover:bg-[#25D366]/20 text-[#25D366] border border-white/10 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>

              {/* LinkedIn Share */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
                className="p-2 rounded-xl bg-white/5 hover:bg-blue-600/20 text-[#0A66C2] border border-white/10 transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>

              {/* Twitter / X Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                title="Share on X"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden mb-10 border border-white/10 shadow-2xl">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="p-6 sm:p-7 rounded-2xl bg-electric-blue/10 border border-electric-blue/30 backdrop-blur-md mb-10 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-electric-blue" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Key Takeaways & Quick Summary
              </h2>
            </div>
            <ul className="space-y-2.5">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check className="w-4 h-4 text-electric-blue shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content Sections */}
        <div className="space-y-10 text-slate-200 leading-relaxed font-sans">
          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-2">
                {section.heading}
              </h2>

              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              ))}

              {/* Comparison Table (if present) */}
              {section.table && (
                <div className="overflow-x-auto my-6 rounded-2xl border border-white/15 bg-navy-950/80 shadow-xl">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-white/10 text-white font-bold border-b border-white/15">
                        {section.table.headers.map((header, hIdx) => (
                          <th key={hIdx} className="py-3 px-4 font-semibold text-white">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {section.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`py-3 px-4 ${cIdx === 0 ? 'font-semibold text-white' : 'text-slate-300'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Callout Tips */}
              {section.tips && section.tips.map((tip, tIdx) => (
                <div key={tIdx} className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-200 text-xs sm:text-sm my-4">
                  {tip}
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* Recommended Hardware Section (Direct Product Conversion) */}
        {article.relatedProducts && article.relatedProducts.length > 0 && (
          <section className="my-14 p-6 sm:p-8 rounded-3xl glass-panel border border-electric-blue/40 bg-navy-950/90 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-electric-blue/15 text-electric-blue">
                  <ShoppingCart className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Recommended Hardware for This Guide
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tested and certified hardware components ready for your build or robotics project.
                  </p>
                </div>
              </div>

              <Link 
                to="/shop" 
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-electric-blue hover:underline"
              >
                Browse All Hardware &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedProducts.map((product) => {
                const isAdded = addedMap[product.slug];
                return (
                  <div 
                    key={product.slug}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-electric-blue/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-16 h-16 rounded-xl bg-navy-900/90 p-2 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        {product.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-electric-blue px-2 py-0.5 rounded bg-electric-blue/15 border border-electric-blue/30 inline-block mb-1">
                            {product.badge}
                          </span>
                        )}
                        <h3 className="text-sm font-bold text-white leading-snug group-hover:text-electric-blue transition-colors">
                          <Link to={`/product/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <span className="text-base font-extrabold text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-2 text-xs text-slate-500 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-white/10 hover:bg-electric-blue text-white hover:text-navy-950'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <Link
                          to={`/product/${product.slug}`}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold"
                        >
                          Specs
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {article.faq && article.faq.length > 0 && (
          <section className="my-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-electric-blue" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-4">
              {article.faq.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl glass-card border border-white/10 bg-navy-950/60"
                >
                  <h3 className="text-base font-bold text-white mb-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Read Next Section */}
        <section className="my-16 pt-10 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Continue Reading</h2>
            <Link to="/blog" className="text-xs font-bold text-electric-blue hover:underline">
              View All Guides &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherArticles.map((nextArt) => (
              <Link
                key={nextArt.slug}
                to={`/blog/${nextArt.slug}`}
                className="group flex flex-col glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-electric-blue/40 transition-all p-3 bg-navy-950/70"
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-navy-900">
                  <img 
                    src={nextArt.coverImage} 
                    alt={nextArt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-bold text-electric-blue uppercase tracking-wider mb-1">
                  {nextArt.category}
                </span>
                <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-electric-blue transition-colors mb-2">
                  {nextArt.title}
                </h3>
                <span className="text-[11px] text-slate-400 mt-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {nextArt.readTime}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  );
}
