import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        subject: location.state.subject || prev.subject,
        message: location.state.message || prev.message
      }));
    }
  }, [location.state]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isHoursOpen, setIsHoursOpen] = useState(false);

  // Business Hours Logic
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = new Date().getDay();
  const currentDayName = days[currentDayIndex];

  const schedule = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'By Appointment' },
  ];

  const todaySchedule = schedule.find(s => s.day === currentDayName) || schedule[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one of email or phone is provided
    if (!formData.email.trim() && !formData.phone.trim()) {
      setError('Please provide either an email address or a phone number so we can reach you.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        created_at: new Date().toISOString(),
        status: 'pending'
      });

      // 2. Send email via Web3Forms
      const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (web3formsAccessKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3formsAccessKey,
            subject: `New Contact Form: ${formData.subject}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        });
        
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to send email via Web3Forms');
        }
      } else {
        throw new Error("VITE_WEB3FORMS_ACCESS_KEY is missing. Please configure it in your environment variables.");
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact Info */}
          <Reveal width="100%">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                <p className="text-lg text-slate-300 mb-6">
                  Have questions about our products or need a custom quote? We're here to help! 
                  Fill out the form or reach out to us directly.
                </p>
                
                <a 
                  href="https://wa.me/919817056538" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="mr-3 h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Message us on WhatsApp
                </a>
              </div>

              <div className="glass-panel p-8 space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <img 
                      src="https://raw.githubusercontent.com/DivyanshJain18/Mechafy-assets/main/Mechafy%20Logo.jpg" 
                      alt="Mechafy Global Logo" 
                      className="h-12 w-auto object-contain rounded mr-4"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">Mechafy Global</h3>
                      <p className="text-sm text-slate-400">(A Unit of Shanti Food Industries)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-electric-blue mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300">
                        582, HSIIDC Industrial Area,<br />
                        Rai, Sonipat, Haryana 131029
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-6 w-6 text-electric-blue mr-3 flex-shrink-0" />
                      <a href="tel:+919817056538" className="text-slate-300 hover:text-electric-blue transition-colors">
                        +91 9817056538
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-6 w-6 text-electric-blue mr-3 flex-shrink-0" />
                      <div className="flex flex-col">
                        <a href="mailto:info@mechafyglobal.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-electric-blue transition-colors">
                          info@mechafyglobal.com
                        </a>
                        <a href="mailto:sales@mechafyglobal.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-electric-blue transition-colors">
                          sales@mechafyglobal.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="w-full">
                      <h4 className="font-bold text-white mb-2">Business Hours</h4>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setIsHoursOpen(!isHoursOpen)}
                          className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors text-sm font-medium text-slate-300 border border-white/10"
                        >
                          <span className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${todaySchedule.hours === 'Closed' ? 'bg-red-500' : todaySchedule.hours === 'By Appointment' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                            Today ({todaySchedule.day}): {todaySchedule.hours}
                          </span>
                          {isHoursOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {isHoursOpen && (
                          <div
                            className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-slate-700 rounded-lg shadow-lg z-10 overflow-hidden"
                          >
                            <ul className="divide-y divide-white/10">
                              {schedule.map((item) => (
                                <li key={item.day} className={`flex justify-between px-4 py-2 text-sm ${item.day === currentDayName ? 'bg-electric-blue/20 text-electric-blue font-medium' : 'text-slate-300 hover:bg-white/5'}`}>
                                  <span>{item.day}</span>
                                  <span>{item.hours}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Map & Form */}
          <Reveal width="100%" delay={0.2}>
            <div className="space-y-8">
              {/* Google Map */}
              <div className="glass-panel overflow-hidden h-64">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.893214057476!2d77.0996!3d28.9505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390db1a555555555%3A0x5555555555555555!2sHSIIDC%20Industrial%20Area%2C%20Rai%2C%20Haryana%20131029!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
                  allowFullScreen={true} 
                  loading="lazy"
                  title="Mechafy Global Location"
                ></iframe>
              </div>

              {/* Contact Form */}
              <div className="glass-panel p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <div className="bg-green-900/20 border border-green-800 text-green-400 p-6 rounded-xl text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-green-900/30 p-3 rounded-full">
                        <Send className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p>Thank you for contacting us. We will get back to you shortly.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-green-400 font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-900/20 text-red-400 p-4 rounded-lg text-sm border border-red-800">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all placeholder-slate-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all placeholder-slate-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all placeholder-slate-500"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all placeholder-slate-500"
                        placeholder="Product Inquiry / Support"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message (Optional)</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all resize-none placeholder-slate-500"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-glow w-full text-white py-4 rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          Send Message <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
