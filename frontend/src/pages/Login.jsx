import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      // Ask Django for a token
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });
      
      // 1. Save the tokens to the browser
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // 2. NEW: Save the user's role! This is the magic key for the security gates.
      localStorage.setItem('user_role', response.data.role);
      
      // 3. Smart Redirect: Send them to the right page based on their role
      if (response.data.role === 'LIBRARIAN' || response.data.role === 'ADMIN') {
          navigate('/librarian');
      } else {
          navigate('/student');
      }
      
    } catch (err) {
      console.error("Login failed:", err);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center mt-16">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8">Sign in to access your library portal.</p>
        
        {error && (
          <div className="bg-rose-100 text-rose-700 p-3 rounded-lg text-sm font-medium mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}