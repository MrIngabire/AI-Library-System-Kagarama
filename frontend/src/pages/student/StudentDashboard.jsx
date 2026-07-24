import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBorrows, setActiveBorrows] = useState([]); // Tracks which books the student has out
  
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchCatalogData = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const bookRes = await axios.get('http://127.0.0.1:8000/api/books/', { headers: { Authorization: `Bearer ${token}` } });
      setBooks(bookRes.data);
      
      const borrowRes = await axios.get('http://127.0.0.1:8000/api/borrowing/', { headers: { Authorization: `Bearer ${token}` } });
      // Filter out only active borrows to know which books to show the "Return" button for
      const borrowedIds = borrowRes.data
        .filter(record => record.status === 'ACTIVE')
        .map(record => record.book);
      setActiveBorrows(borrowedIds);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
      }
    }
  };

  useEffect(() => { fetchCatalogData(); }, []);

  const handleBorrow = async (bookId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`http://127.0.0.1:8000/api/books/${bookId}/borrow/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchCatalogData(); // Refresh to flip button to 'Return'
    } catch (error) {
        alert(error.response?.data?.error || "Failed to borrow book.");
    }
  };

  const handleReturn = async (bookId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`http://127.0.0.1:8000/api/books/${bookId}/return/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchCatalogData(); // Refresh to flip button back to 'Borrow'
    } catch (error) {
        alert(error.response?.data?.error || "Failed to return book.");
    }
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/ai-recommendations/', { headers: { Authorization: `Bearer ${token}` } });
      setAiRecommendation(response.data.recommendation);
    } catch (error) {
      setAiRecommendation("The AI Librarian is currently resting. Please try again later!");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl text-white">
        <h2 className="text-3xl font-extrabold mb-2 text-emerald-400">Your AI Librarian</h2>
        <p className="text-slate-300 mb-6">Get personalized reading recommendations based on your borrowing history.</p>
        
        {aiRecommendation ? (
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
             <p className="text-lg leading-relaxed text-slate-100 italic">"{aiRecommendation}"</p>
          </div>
        ) : (
          <button onClick={handleAskAI} disabled={aiLoading} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50">
            {aiLoading ? 'Analyzing Your History...' : 'Ask for a Recommendation'}
          </button>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Library Catalog</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-32"><p className="text-slate-500 text-lg animate-pulse">Loading library data...</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => {
              const isBorrowedByMe = activeBorrows.includes(book.id);
              
              return (
                <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  {/* NEW: Cover Image Display */}
                  <div className="h-48 bg-slate-100 relative">
                    {book.cover_image ? (
                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Cover</div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 mb-1">{book.title}</h3>
                      <p className="text-slate-600 font-medium mb-4">by {book.author}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100 mb-6">
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase">{book.genre}</span>
                        <span className="text-sm font-medium text-slate-500">{book.available_copies} / {book.total_copies} available</span>
                      </div>
                    </div>
                    
                    {/* Dynamic Borrow / Return Button */}
                    {isBorrowedByMe ? (
                        <button onClick={() => handleReturn(book.id)} className="w-full py-3 rounded-xl font-bold transition-colors bg-amber-500 text-white hover:bg-amber-600 shadow-md">
                            Return Book
                        </button>
                    ) : (
                        <button onClick={() => handleBorrow(book.id)} disabled={book.available_copies <= 0} className={`w-full py-3 rounded-xl font-bold transition-colors ${book.available_copies > 0 ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                            {book.available_copies > 0 ? 'Borrow Book' : 'Out of Stock'}
                        </button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {books.length === 0 && <p className="text-slate-500 col-span-full">No books found in the catalog.</p>}
          </div>
        )}
      </div>
    </div>
  );
}