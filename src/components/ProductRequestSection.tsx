import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Send, CheckCircle, PackageSearch, AlertCircle } from 'lucide-react';
import { submitToWeb3Forms } from '../services/emailService';

export function ProductRequestSection() {
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    model: '',
    quantity: '1',
    budget: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      setError('Please provide product name and contact details (phone or email).');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Log to Firestore
      const docRef = await addDoc(collection(db, 'procurement_requests'), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'open'
      });

      // 2. Email notification to sales@mechafyglobal.com via Web3Forms
      const emailResult = await submitToWeb3Forms({
        subject: `New Sourcing Request: ${formData.productName} (${formData.quantity} units)`,
        fromName: 'Mechafy Sourcing Desk',
        replyTo: formData.email,
        fields: {
          product_name: formData.productName,
          brand: formData.brand || 'Unspecified',
          model: formData.model || 'Unspecified',
          quantity: formData.quantity,
          budget_inr: formData.budget || 'Open / Market Rate',
          phone: formData.phone,
          email: formData.email,
          notes: formData.notes || 'None',
          request_id: docRef.id
        }
      });

      if (!emailResult.success) {
        console.warn('[ProductRequestSection email warning]', emailResult.message);
      }

      setSubmitted(true);
      setFormData({
        productName: '',
        brand: '',
        model: '',
        quantity: '1',
        budget: '',
        phone: '',
        email: '',
        notes: ''
      });
    } catch (err: any) {
      console.error('Failed to submit product request', err);
      setError('Failed to record inquiry. Please contact us via phone or WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#090E1A] border-y border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Context */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded">
              <PackageSearch className="w-3.5 h-3.5" />
              <span>Direct Procurement Desk</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Can't Find the Specific Product or Component?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Our engineering sourcing team imports and procures hard-to-find robotics, microcontrollers, graphics cards, server parts, and 3D printing consumables directly from global tier-1 supply networks.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400 border-t border-white/10 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Response SLA: Within 4–6 business hours with lead times</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>GST Tax Invoice supplied for institutional & corporate accounts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Bulk sample verification available on qualified orders</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Form */}
          <div className="lg:col-span-7 bg-[#0C1322] border border-white/10 rounded-lg p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Sourcing Request Received</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Our technical procurement engineers are checking availability and current market pricing. You will receive an official quotation shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-blue-400 hover:underline"
                >
                  Submit another part request &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Product / Component Name *</label>
                    <input
                      type="text"
                      name="productName"
                      required
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="e.g. NVIDIA RTX 4090 / NEMA 23 Motor / ESP32-S3"
                      className="input-tech"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Brand (Optional)</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="e.g. Zotac, Espressif"
                      className="input-tech"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Part / Model Number</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. ZT-D40900B-10P"
                      className="input-tech font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity Required</label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 10 units"
                      className="input-tech font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Budget (INR)</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g. ₹50,000 / unit"
                      className="input-tech font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="input-tech"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="procurement@company.com"
                      className="input-tech"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Specifications or Timeline</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Specify target delivery location, urgency, or compatibility notes..."
                    className="input-tech resize-none"
                  ></textarea>
                </div>

                {error && (
                  <div className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    No spam. Your requirements remain confidential.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Sourcing Request'}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
