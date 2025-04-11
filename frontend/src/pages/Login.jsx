import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCSRFToken } from '../api/csrf';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('');
    setLoading(true);

    try {
      const csrfToken = await getCSRFToken();

      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken, // 👈 crucial
        },
        credentials: 'include',
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (res.ok) {
        navigate('/dashboard');
      } else {
        setErrors('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>

      {errors && <p className="text-sm text-red-500 mb-4">{errors}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
