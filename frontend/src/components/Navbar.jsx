import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:8000/api/user/', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error('Navbar user fetch error:', err);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-semibold">
        <Link to="/">📚 BookClub</Link>
      </div>

      <div className="flex gap-6 items-center text-sm">
        <Link to="/books" className="hover:text-blue-300">Books</Link>
        <Link to="/reading-lists" className="hover:text-blue-300">Reading List</Link>
        <Link to="/meetings" className="hover:text-blue-300">Meetings</Link>

        {user ? (
          <>
            <span className="hidden sm:inline">Hello, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/signup" className="hover:text-blue-300">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
