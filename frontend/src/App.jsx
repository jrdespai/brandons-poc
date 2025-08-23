

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist token in localStorage
  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setToken(data.token);
      setUser({ email });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email }));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setUser({ email });
      setToken(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setImages([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch images');
      setImages(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImages((imgs) => [...imgs, { id: data.id || Date.now(), url: data.url, name: file.name }]);
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/images/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      setImages((imgs) => imgs.filter((img) => img.id !== id));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && token) fetchImages();
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Image Manager</h1>
        {!user ? (
          <>
            <form onSubmit={handleLogin} className="mb-4">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full mb-2" required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered w-full mb-2" required />
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>Login</button>
            </form>
            <form onSubmit={handleRegister}>
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full mb-2" required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input input-bordered w-full mb-2" required />
              <button type="submit" className="btn btn-secondary w-full" disabled={loading}>Register</button>
            </form>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span>Welcome, {user.email}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">Logout</button>
            </div>
            <form onSubmit={handleUpload} className="mb-4">
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="file-input file-input-bordered w-full mb-2" />
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>Upload Image</button>
            </form>
            <div>
              <h2 className="text-lg font-semibold mb-2">Your Images</h2>
              {images.length === 0 ? <p>No images uploaded yet.</p> : (
                <div className="grid grid-cols-2 gap-2">
                  {images.map(img => (
                    <div key={img.id} className="relative">
                      <img src={img.url} alt={img.name} className="w-full h-32 object-cover rounded" />
                      <button onClick={() => handleDelete(img.id)} className="absolute top-1 right-1 btn btn-xs btn-error">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
}

export default App;
