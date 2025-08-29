import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess(false);
		try {
			const res = await fetch(`${API_URL}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Registration failed');
			setSuccess(true);
			setEmail('');
			setPassword('');
		} catch (err) {
			setError(err.message);
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
			<div className="w-full max-w-md bg-white rounded-lg shadow p-6">
				<h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
				<form onSubmit={handleRegister} className="mb-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 mb-2"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 mb-2"
						required
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white py-2 px-4 rounded w-full"
						disabled={loading}
					>
						Register
					</button>
				</form>
				{error && <div className="text-red-500 mb-2 text-center">{error}</div>}
				{success && <div className="text-green-600 mb-2 text-center">Registration successful! You can now <Link to="/">login</Link>.</div>}
				<div className="text-center">
					<Link to="/" className="text-blue-500 underline">
						Back to Login
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Register;
