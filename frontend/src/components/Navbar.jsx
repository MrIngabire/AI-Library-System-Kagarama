import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // This fires automatically every single time the user changes pages
  useEffect(() => {
    // Check if the JWT access token exists in local storage
    const token = localStorage.getItem('access_token');
    
    // Sets isLoggedIn to true if a token exists, false if it doesn't
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    // 1. Wipe the entire authentication state from the browser storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    
    // 2. Flip the state back to false
    setIsLoggedIn(false);
    
    // 3. Kick them back to the login screen
    alert("You have been logged out successfully.");
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-8 py-5 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Brand Logo */}
      <div>
        <Link to="/" className="text-2xl font-black tracking-wider text-emerald-400 uppercase select-none">
          ES Kagarama Library
        </Link>
      </div>
      
      {/* Navigation Links & Dynamic Button */}
      <div className="flex items-center space-x-8 font-semibold text-slate-300">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/student" className="hover:text-white transition-colors">Student</Link>
        <Link to="/librarian" className="hover:text-white transition-colors">Librarian</Link>
        
        {/* Conditional Rendering Logic */}
        {isLoggedIn ? (
          // Renders the red Log Out button if the user has an active session
          <button 
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md hover:shadow-rose-900/20"
          >
            Log Out
          </button>
        ) : (
          // Renders the green Log In button if no token is found
          <Link 
            to="/login"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 px-6 rounded-xl transition-all shadow-md text-center"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}