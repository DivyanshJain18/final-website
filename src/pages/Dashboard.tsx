import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, 'orders'),
            where('user_id', '==', user.id)
          );
          const snapshot = await getDocs(q);
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          
          // Sort on client side to avoid requiring a composite index
          ordersData.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
        <p className="text-slate-400">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / User Info */}
        <Reveal width="100%">
          <div className="glass-panel p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Account Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-slate-300">Name:</span> {user.name}</p>
              <p><span className="font-medium text-slate-300">Email:</span> {user.email}</p>
              <p><span className="font-medium text-slate-300">Member since:</span> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </Reveal>

        {/* Order History */}
        <div className="lg:col-span-2">
          <Reveal width="100%" delay={0.2}>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Quote History</h2>
              
              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"></div>)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="glass-panel p-6 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">Quote #{order.id.slice(0, 8)}</div>
                        <div className="text-sm text-slate-400">{new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">₹{order.total_amount?.toFixed(2) || '0.00'}</div>
                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full mt-1 
                          ${order.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                            order.status === 'approved' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel p-8 text-center text-slate-400">
                  You haven't requested any quotes yet.
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
