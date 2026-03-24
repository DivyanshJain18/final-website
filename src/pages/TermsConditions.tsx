import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';

export default function TermsConditions() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal width="100%">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Terms & Conditions</h1>
          <div className="prose prose-invert max-w-none text-slate-300 space-y-8">
            <p className="text-slate-400">Last updated: March 24, 2026</p>
            
            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing our website and using our B2B IT services or purchasing hardware, you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">2. Services & Hardware</h2>
              <p className="leading-relaxed mb-4">
                Mechafy Global provides B2B IT services and acts as a supplier for robotics, microcontrollers, and computer components.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li>All hardware specifications are subject to change based on manufacturer updates.</li>
                <li>Custom software development timelines are estimates and subject to project scope changes.</li>
                <li>We reserve the right to refuse service or cancel orders at our discretion.</li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">3. Quotations & Pricing</h2>
              <p className="leading-relaxed mb-4">
                Prices for our products and services are subject to change without notice.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li>Quotations provided are valid for 15 days unless otherwise specified.</li>
                <li>Bulk order discounts are applied at the discretion of Mechafy Global.</li>
                <li>All prices are exclusive of applicable taxes and shipping costs unless stated otherwise.</li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">4. Payment Terms</h2>
              <p className="leading-relaxed">
                Payment terms will be specified in the invoice or quotation. For hardware orders, full or partial advance payment may be required before dispatch. 
                For IT services, milestone-based payments will be agreed upon in the service contract.
              </p>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">5. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall Mechafy Global, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">6. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="mt-4 space-y-2 text-slate-400">
                <li>Email: info@mechafyglobal.com</li>
                <li>Phone: +91 7015072323</li>
                <li>Address: 582, HSIIDC Industrial Area, Rai, Sonipat, Haryana 131029, IN</li>
              </ul>
            </section>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
