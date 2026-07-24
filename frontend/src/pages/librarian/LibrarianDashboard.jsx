import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Read the current user's role from local storage
  const userRole = localStorage.getItem('user_role');
  
  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', genre: '', total_copies: 1, available_copies: 1
  });
  const [coverImage, setCoverImage] = useState(null);

  const fetchBooks = () => {
    const token = localStorage.getItem('access_token');
    axios.get('http://127.0.0.1:8000/api/books/', { 
        headers: { Authorization: `Bearer ${token}` } 
    })
      .then(response => { setBooks(response.data); setLoading(false); })
      .catch(error => { console.error("Error fetching data:", error); setLoading(false); });
  };

  useEffect(() => {
    // Only attempt to pull backend data if the user is authorized staff
    if (userRole === 'ADMIN' || userRole === 'LIBRARIAN') {
        fetchBooks();
    }
  }, [userRole]);

  // --- HARD FRONTEND GATE INTERCEPT ---
  if (userRole !== 'ADMIN' && userRole !== 'LIBRARIAN') {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✕
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 leading-relaxed">
          This section is strictly reserved for administrative staff and librarians of ES Kagarama. Your current account permissions do not allow entry.
        </p>
      </div>
    );
  }

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    const formData = new FormData();
    Object.keys(newBook).forEach(key => formData.append(key, newBook[key]));
    if (coverImage) formData.append('cover_image', coverImage);
    
    try {
      await axios.post('http://127.0.0.1:8000/api/books/', formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        }
      });
      setNewBook({ title: '', author: '', isbn: '', genre: '', total_copies: 1, available_copies: 1 });
      setCoverImage(null);
      document.getElementById('coverImageInput').value = ''; 
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Security Blocked: You do not possess structural permissions to edit this catalog.");
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to remove this book from the library?")) return;
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/books/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Action failed. Server permissions denied.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Book</h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Title</label><input type="text" required value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Author</label><input type="text" required value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">ISBN</label><input type="text" required value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Genre</label><input type="text" required value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image</label>
                <input id="coverImageInput" type="file" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Total Copies</label><input type="number" min="1" required value={newBook.total_copies} onChange={e => setNewBook({...newBook, total_copies: e.target.value, available_copies: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>
            </div>
            
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors mt-4">Add to Catalog</button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Inventory Management</h2>
        {loading ? <p className="text-slate-500">Loading catalog...</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Book Info</th>
                  <th className="p-4 font-semibold">Genre</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center space-x-4">
                      {book.cover_image && <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />}
                      <div>
                        <p className="font-bold text-slate-800">{book.title}</p>
                        <p className="text-sm text-slate-500">{book.author}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">{book.genre}</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${book.available_copies > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {book.available_copies}/{book.total_copies}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteBook(book.id)} className="text-rose-500 hover:text-rose-700 font-semibold text-sm transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && <p className="p-6 text-center text-slate-500">No books in the inventory.</p>}
          </div>
        )}
      </div>
    </div>
  );
}