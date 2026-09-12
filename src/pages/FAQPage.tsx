import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    category: "General",
    questions: [
      { q: "What products do you supply?", a: "We supply a wide range of robotics systems, electronic modules, computer hardware, and industrial components." },
      { q: "Which industries do you serve?", a: "We serve various industries including manufacturing, IT, education, robotics, and automation sectors." },
      { q: "Do you source items on request?", a: "Yes, we specialize in sourcing specific industrial components based on your unique requirements." }
    ]
  },
  {
    category: "IT Services",
    questions: [
      { q: "What IT services do you offer?", a: "We specialize in custom software development, website building, e-commerce solutions, and digital marketing tailored for B2B clients." },
      { q: "Do you build custom software for specific industries?", a: "Yes, we develop tailored software solutions designed to meet the unique operational needs of manufacturing, logistics, education, and corporate sectors." },
      { q: "Can you help with our digital marketing strategy?", a: "Absolutely. We provide comprehensive digital marketing services including SEO, social media management, lead generation, and targeted B2B campaigns." }
    ]
  },
  {
    category: "Request Quote",
    questions: [
      { q: "How can I request a quotation?", a: "You can request a quotation by filling out the contact form on our website or emailing us directly with your requirements." },
      { q: "What details should I include in RFQ?", a: "Please include product specifications, quantities required, delivery location, and any specific brand preferences." },
      { q: "Is there minimum order quantity?", a: "Minimum order quantities vary depending on the product. Please contact us with your specific needs." },
      { q: "How fast will I receive quotation?", a: "We typically respond to all RFQs within 24-48 business hours." }
    ]
  },
  {
    category: "Orders",
    questions: [
      { q: "Do you support bulk orders?", a: "Yes, we are fully equipped to handle and supply large-scale bulk orders for B2B clients." },
      { q: "Can you source branded products?", a: "Absolutely. We have partnerships with various manufacturers to source specific branded items." },
      { q: "Do you provide custom sourcing?", a: "Yes, our team can help source hard-to-find or custom components tailored to your project." }
    ]
  },
  {
    category: "Delivery",
    questions: [
      { q: "What is delivery timeline?", a: "Delivery timelines depend on the product availability and order size, typically ranging from a few days to a few weeks." },
      { q: "Do you supply across India?", a: "Yes, we provide shipping and supply services across all major locations in India." },
      { q: "Do you support urgent requirements?", a: "We do our best to accommodate urgent requests. Please highlight the urgency when submitting your RFQ." }
    ]
  },
  {
    category: "Support",
    questions: [
      { q: "How can I contact Mechafy Global?", a: "You can reach us via our Contact page, email, or phone number listed on our website." },
      { q: "Do you provide technical assistance?", a: "Yes, our team provides basic technical guidance and support for the products we supply." },
      { q: "Do you help in product selection?", a: "Yes, our experts can assist you in selecting the right products and components for your specific applications." }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a
        }
      }))
    )
  };

  return (
    <Layout>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal width="100%">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Find answers to common questions about our products, quotes, delivery, and support services.
            </p>
          </div>
        </Reveal>

        <div className="space-y-12">
          {faqs.map((category, catIndex) => (
            <Reveal key={catIndex} width="100%" delay={catIndex * 0.1}>
              <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 shadow-lg">
                <h2 className="text-xl font-bold text-electric-blue mb-6 tracking-wide border-b border-white/10 pb-4">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, qIndex) => {
                    const id = `${catIndex}-${qIndex}`;
                    const isOpen = openIndex === id;
                    return (
                      <div 
                        key={qIndex} 
                        className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-electric-blue/50 ring-1 ring-electric-blue/50 bg-white/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                      >
                        <button
                          onClick={() => toggleFAQ(id)}
                          className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
                          aria-expanded={isOpen}
                        >
                          <span className="font-semibold text-left text-slate-200 pr-4 text-lg">{item.q}</span>
                          <ChevronDown 
                            className={`w-6 h-6 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-electric-blue' : ''}`} 
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="px-6 pb-6">
                                <p className="text-slate-400 text-base leading-relaxed">
                                  {item.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
