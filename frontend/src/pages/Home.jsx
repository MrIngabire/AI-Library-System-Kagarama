import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 px-4">
      
      {/* Hero Section */}
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 w-full max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          {/* A generic book/library icon made with Tailwind */}
          <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Welcome to <span className="text-emerald-500">ES Kagarama</span> Library
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover your next favorite book with our AI-powered reading guide. Please select your portal below to access the library system.
        </p>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          
          {/* Student Card */}
          <Link to="/student" className="group block p-8 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-emerald-500 hover:shadow-lg hover:bg-emerald-50 transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-700 mb-2">Student Portal</h3>
            <p className="text-slate-500 text-sm">Browse the catalog, request books, and chat with our AI reading assistant.</p>
          </Link>

          {/* Librarian Card */}
          <Link to="/librarian" className="group block p-8 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-blue-500 hover:shadow-lg hover:bg-blue-50 transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 mb-2">Librarian Portal</h3>
            <p className="text-slate-500 text-sm">Manage inventory, process book returns, and track student borrowing history.</p>
          </Link>

        </div>
      </div>

    </div>
  );
}