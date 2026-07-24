import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 

// NEW: Import the Home screen we just made!
import Home from './pages/Home'; 

import StudentDashboard from './pages/student/StudentDashboard';
import LibrarianDashboard from './pages/librarian/LibrarianDashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        
        <Navbar />

        <main className="p-8">
          <Routes>
            {/* NEW: Use the <Home /> component here! */}
            <Route path="/" element={<Home />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/librarian" element={<LibrarianDashboard />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;