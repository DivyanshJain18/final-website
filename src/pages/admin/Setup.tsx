import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

const AdminSetup: React.FC = () => {
  const [email] = useState('director@mechafyglobal.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (email !== 'director@mechafyglobal.com') {
      setError('Only the authorized admin email can be used for setup.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Add the user to Firestore with the 'admin' role
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        name: 'Mechafy Admin',
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      // 3. Redirect to admin dashboard
      navigate('/admin');
    } catch (err: any) {
      // Handle "email already in use" gracefully
      if (err.code === 'auth/email-already-in-use') {
        setError('Admin account already exists. Please go to the Login page.');
      } else {
        setError(err.message || 'Failed to create admin account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-slate-400">Create your master admin account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400"
          >
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Locked to authorized admin email for security.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Set Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-glow w-full text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-electric-blue hover:text-blue-400 transition-colors"
          >
            Already set up? Go to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSetup;
