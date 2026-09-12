import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Stats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsSnap, ordersSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'users'))
        ]);

        let revenue = 0;
        ordersSnap.forEach(doc => {
          revenue += doc.data().total_amount || 0;
        });

        setStats({
          products: productsSnap.size,
          orders: ordersSnap.size,
          users: usersSnap.size,
          revenue
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center text-slate-400 p-8">Loading dashboard stats...</div>;
  }

  if (!stats) {
    return <div className="text-center text-red-400 p-8">Failed to load stats.</div>;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex items-center gap-2 text-sm text-slate-400 glass-panel px-4 py-2 border border-white/10">
          <Activity size={16} className="text-electric-blue" />
          <span>Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border ${stat.border} ${stat.bg} backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-zinc-950/50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={16} className="text-slate-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {/* Placeholder for recent orders list */}
            <p className="text-slate-500 text-sm">No recent orders to display.</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-4">Low Stock Alert</h2>
          <div className="space-y-4">
            {/* Placeholder for low stock items */}
            <p className="text-slate-500 text-sm">All products are well stocked.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
