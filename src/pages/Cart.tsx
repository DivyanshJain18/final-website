import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Layout } from '../components/Layout';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestQuote = async () => {
    if (user) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'orders'), {
          user_id: user.id,
          user_name: user.name,
          user_email: user.email,
          items: items.map(item => ({
            product_id: item.id,
            name: item.name,
            sku: item.sku || null,
            quantity: item.quantity,
            price: item.price
          })),
          total_amount: total * 1.08,
          status: 'pending',
          created_at: new Date().toISOString()
        });

        // Send email via Web3Forms
        const web3formsAccessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        if (web3formsAccessKey) {
          const itemsList = items.map(item => `- ${item.name} ${item.sku ? `[SKU: ${item.sku}]` : ''} (Qty: ${item.quantity})`).join('\n');
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              access_key: web3formsAccessKey,
              subject: `New Quote Request from ${user.name}`,
              name: user.name,
              email: user.email,
              message: `New Quote Request from ${user.name} (${user.email})\n\nItems:\n${itemsList}\n\nTotal Est: ₹${(total * 1.08).toFixed(2)}`,
            }),
          });
          
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to send email via Web3Forms');
          }
        } else {
          console.warn("VITE_WEB3FORMS_ACCESS_KEY is missing. Email notification was not sent.");
          // We don't throw error here because the order was already saved to Firestore, 
          // and we don't want to fail the whole process just because email failed.
        }

        setSuccessMessage('Your quote request has been submitted successfully.');
        clearCart();
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Failed to submit quote:', error);
        alert('Failed to submit quote. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Format cart items into a string
      const itemsList = items.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n');
      const message = `I would like to request a quote for the following items:\n\n${itemsList}\n\nTotal Est: ₹${total.toFixed(2)}`;
      navigate('/contact', { state: { message, subject: 'Quote Request from Cart' } });
    }
  };

  if (successMessage) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-green-900/30 text-green-400 p-8 rounded-2xl mb-6 border border-green-800">
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p>{successMessage}</p>
          </div>
          <p className="text-slate-400">Redirecting to your dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            You haven't added any products to your cart yet. Explore our wide collection of hardware and components.
          </p>
          <Link to="/shop" className="btn-glow inline-flex items-center justify-center gap-2 px-6 py-2.5">
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow space-y-4">
            <StaggerContainer className="space-y-4" staggerDelay={0.08}>
              {items.map(item => (
                <StaggerItem key={item.id}>
                  <div 
                    className="glass-panel p-4 flex items-center gap-4 hover:border-blue-500/30 transition-all rounded-2xl"
                  >
                    <div className="w-20 h-20 shrink-0 bg-white/[0.03] border border-white/10 rounded-xl p-2 flex items-center justify-center">
                      <img src={item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-white text-base truncate">{item.name}</h3>
                      {item.sku && (
                        <p className="text-xs font-mono text-slate-400 mt-0.5">SKU: {item.sku}</p>
                      )}
                      <p className="text-blue-400 font-bold font-mono tabular-nums text-sm mt-1">₹{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1 shrink-0">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-white font-mono text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors shrink-0 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Reveal width="100%" delay={0.2}>
              <div className="glass-panel p-6 sticky top-24 rounded-2xl">
                <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-2.5 mb-5 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-mono tabular-nums">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (Est.)</span>
                    <span className="text-white font-mono tabular-nums">₹{(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white text-base">
                    <span>Total</span>
                    <span className="text-blue-400 font-mono tabular-nums text-lg">₹{(total * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleRequestQuote}
                  disabled={isSubmitting}
                  className="btn-glow w-full text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : 'Request Official Quote'}
                </button>
                
                <p className="mt-3.5 text-[11px] text-slate-400 text-center leading-relaxed">
                  Verified quotations with GST invoice issued within 24 hours. No payment required upfront.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </Layout>
  );
}
