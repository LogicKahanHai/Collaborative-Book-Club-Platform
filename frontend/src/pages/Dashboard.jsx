import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        // Fetch CSRF token first
        // await fetch('http://localhost:8000/api/csrf/', {
        //   credentials: 'include',
        // });
        const res = await fetch('http://localhost:8000/api/user/', {
          credentials: 'include',
        });

        console.log('Response:', res);

        if (res.status === 403 || res.status === 401) {
          navigate('/login'); // not logged in
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/login');
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.username} 👋</h1>

      <p className="mb-4">Email: {user?.email}</p>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
