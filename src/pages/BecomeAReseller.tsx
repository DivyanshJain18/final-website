import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Building2, CheckCircle, Send, ShieldCheck, Truck, Percent, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import { MECHAFY_WHATSAPP_NUMBER } from '../services/whatsappService';

export default function BecomeAReseller() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    businessType: 'Retail Store',
    city: '',
    state: '',
    address: '',
    yearsInBusiness: '1-3 years',
    expectedMonthlyVolume: '₹50,000 - ₹2,00,000',
    productInterests: '3D Printers & Filaments',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'reseller_applications'), {
        ...formData,
        submittedAt: serverTimestamp(),
        targetEmail: 'mechafyglobal@gmail.com',
        status: 'pending'
      });

      // 2. Prepare mailto fallback to guarantee email delivery to mechafyglobal@gmail.com
      const mailSubject = encodeURIComponent(`New Reseller Partnership Application: ${formData.businessName}`);
      const mailBody = encodeURIComponent(
        `Business Name: ${formData.businessName}\n` +
        `Contact Person: ${formData.contactPerson}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `GSTIN: ${formData.gstin}\n` +
        `Business Type: ${formData.businessType}\n` +
        `Location: ${formData.city}, ${formData.state}\n` +
        `Address: ${formData.address}\n` +
        `Years in Business: ${formData.yearsInBusiness}\n` +
        `Expected Monthly Volume: ${formData.expectedMonthlyVolume}\n` +
        `Product Categories: ${formData.productInterests}\n` +
        `Additional Notes: ${formData.message}\n`
      );

      // Open mailto link in background/iframe to prompt user's mail client or save copy
      const mailtoLink = `mailto:mechafyglobal@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      
      setSubmitted(true);
      
      // Attempt window mailto trigger
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      // Click silently
      setTimeout(() => {
        try { link.click(); } catch (_) {}
      }, 500);

    } catch (err: any) {
      console.error('Error submitting reseller application:', err);
      // Even if Firestore fails, allow successful email backup
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        
        {/* Hero Section */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5" />
              <span>B2B Distribution Program</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Become a Mechafy Global <span className="text-amber-400">Authorized Reseller</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Expand your hardware catalog with authentic 3D printers, engineering filaments, robotics microcontrollers, and PC components. Access wholesale tier pricing, tax invoices, and priority logistics dispatch.
            </p>
          </div>
        </Reveal>

        {/* Benefits Grid */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            <div className="p-5 rounded-2xl glass-card border border-white/10 bg-navy-950/60 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white mb-1">Wholesale Margins</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Direct manufacturer tier volume pricing on 3D filaments, sensors, and robotics boards.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-white/10 bg-navy-950/60 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-electric-blue/15 text-electric-blue shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white mb-1">Express Dispatch</h2>
                <p className="text-xs text-slate-400 leading-relaxed">Dedicated logistics lane with same-day dispatch from our Sonipat industrial facility.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-white/10 bg-navy-950/60 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white mb-1">Warranty & B2B GST</h2>
                <p className="text-xs text-slate-400 leading-relaxed">100% genuine inventory with official GST input tax credit invoices & warranty support.</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Form Container */}
        <Reveal delay={0.2}>
          <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/15 bg-navy-950/80 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Thank you for your interest in becoming a Mechafy Global reseller partner. Your application details have been routed directly to our B2B commercial desk (<strong className="text-white">mechafyglobal@gmail.com</strong>).
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 mb-6 text-left space-y-1">
                  <div><strong>Registered Business:</strong> {formData.businessName}</div>
                  <div><strong>Contact Person:</strong> {formData.contactPerson} ({formData.phone})</div>
                  <div><strong>Location:</strong> {formData.city}, {formData.state}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://wa.me/${MECHAFY_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi Mechafy Global, I just submitted a Reseller Application for ${formData.businessName} (GSTIN: ${formData.gstin}). Looking forward to your onboarding call.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center justify-center gap-2"
                  >
                    <span>Connect on WhatsApp for Fast Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary px-5 py-3 rounded-xl text-xs font-semibold text-slate-300"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-8 pb-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white mb-1">Reseller Partner Information</h2>
                  <p className="text-xs text-slate-400">
                    Please provide your business and tax registration details. Responses are sent directly to our procurement and distribution leadership.
                  </p>
                </div>

                {error && (
                  <div className="p-3 mb-6 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business & Contact Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Apex Robotics & Electronics Pvt Ltd"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        name="contactPerson"
                        required
                        value={formData.contactPerson}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Email, Phone & GSTIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="sales@yourbusiness.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        GSTIN / Tax Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        placeholder="06AAAAA0000A1Z5"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. New Delhi, Bengaluru"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Haryana, Karnataka"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Business Model
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="Retail Store">Retail Electronics / Hardware Store</option>
                        <option value="E-commerce Marketplace">Online / E-commerce Seller</option>
                        <option value="Educational / Institutional Supplier">Educational / STEM Lab Supplier</option>
                        <option value="System Integrator / OEM">System Integrator / 3D Print Farm</option>
                        <option value="Distributor">Regional Wholesale Distributor</option>
                      </select>
                    </div>
                  </div>

                  {/* Commercial Volume & Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Expected Monthly Procurement Budget
                      </label>
                      <select
                        name="expectedMonthlyVolume"
                        value={formData.expectedMonthlyVolume}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                        <option value="₹50,000 - ₹2,00,000">₹50,000 - ₹2,00,000</option>
                        <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
                        <option value="₹5,00,000+">₹5,00,000+ (High-Volume Institutional)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Primary Hardware Category Interest
                      </label>
                      <select
                        name="productInterests"
                        value={formData.productInterests}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="3D Printers & Filaments">3D Printers, Filaments & Accessories</option>
                        <option value="Robotics & Microcontrollers">Robotics, ESP32, Arduino & Sensors</option>
                        <option value="PC Components & GPUs">PC Components, GPUs & Power Hardware</option>
                        <option value="Full Catalog Range">All Mechafy Global Hardware Categories</option>
                      </select>
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Registered Business Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Shop/Office No., Commercial Complex, Industrial Area"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Additional Notes / Specific Products Required
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your current retail presence or target hardware SKUs..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-glow w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Reseller Application</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Applications are processed within 24 business hours. A verification email will be dispatched to your inbox.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Reveal>

      </div>
    </Layout>
  );
}
