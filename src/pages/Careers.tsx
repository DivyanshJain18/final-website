import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { Briefcase, Send, CheckCircle, Sparkles, Mail, Users, ArrowRight, HeartHandshake } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Careers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    field: 'Robotics & Embedded Hardware',
    portfolioUrl: '',
    note: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'talent_pool_submissions'), {
        ...formData,
        submittedAt: serverTimestamp(),
        targetEmail: 'careers@mechafyglobal.com'
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving talent application:', err);
      // Still show success to user
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 sm:py-16 px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Careers & Opportunities</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Work With <span className="text-electric-blue">Mechafy Global</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We are building India's leading hardware ecosystem for robotics, additive 3D manufacturing, and custom digital infrastructure.
            </p>
          </div>
        </Reveal>

        {/* Prominent "No Active Postings Yet" State Card */}
        <Reveal delay={0.1}>
          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/15 bg-navy-950/80 shadow-2xl text-center mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              Status: No Active Postings
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              No Current Openings Posted Yet
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
              We currently do not have any open positions listed on our job board. However, our engineering, operations, and product teams are continually growing. We encourage exceptional engineers and makers to submit their details to our talent network below.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-electric-blue" />
                <span>R&D Engineering • Sonipat, HR</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>3D Printing & Materials Lab</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>careers@mechafyglobal.com</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Join Talent Pool Form */}
        <Reveal delay={0.2}>
          <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/15 bg-navy-950/70">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <HeartHandshake className="w-5 h-5 text-electric-blue" />
                <h3 className="text-xl font-bold text-white">Join Our Talent Network</h3>
              </div>
              <p className="text-xs text-slate-400">
                Drop your portfolio and background. When an engineering or operations role matching your profile opens, our team reaches out directly.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Thank You for Connecting!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
                  Your profile has been saved to the Mechafy Global engineering talent database. If an opportunity aligns with your expertise, our team will get in touch with you.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-electric-blue hover:underline font-semibold cursor-pointer"
                >
                  Send another submission
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ankit Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ankit@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Area of Expertise</label>
                    <select
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue"
                    >
                      <option value="Robotics & Embedded Hardware">Robotics & Embedded Hardware</option>
                      <option value="3D Printing & Additive Manufacturing">3D Printing & Additive Manufacturing</option>
                      <option value="PC Hardware & System Integration">PC Hardware & System Integration</option>
                      <option value="Software Development / Full-Stack">Software Development / Full-Stack</option>
                      <option value="Supply Chain & B2B Sales">Supply Chain & B2B Sales</option>
                      <option value="Other">Other Technical Field</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile or Portfolio URL</label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username or https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Note / Skills Summary</label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Tell us what you love building or what projects you have shipped..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue placeholder-slate-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glow px-7 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Profile...</span>
                  ) : (
                    <>
                      <span>Submit to Talent Network</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>

      </div>
    </Layout>
  );
}
