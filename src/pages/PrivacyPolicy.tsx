import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal width="100%">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none text-slate-300 space-y-8">
            <p className="text-slate-400">Last updated: March 24, 2026</p>
            
            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                Welcome to Mechafy Global. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                and tell you about your privacy rights.
              </p>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">2. Data We Collect</h2>
              <p className="leading-relaxed mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">3. How We Use Your Data</h2>
              <p className="leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-400">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">4. Cookies</h2>
              <p className="leading-relaxed">
                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. 
                If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
              </p>
            </section>

            <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-electric-blue mb-4">5. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <ul className="mt-4 space-y-2 text-slate-400">
                <li>Email: info@mechafyglobal.com</li>
                <li>Phone: +91 9817056538</li>
                <li>Address: 582, HSIIDC Industrial Area, Rai, Sonipat, Haryana 131029, IN</li>
              </ul>
            </section>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
