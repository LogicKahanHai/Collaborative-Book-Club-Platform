import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ReadingLists() {
  const [lists, setLists] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLists() {
      const res = await fetch('http://localhost:8000/api/reading-lists/', {
        credentials: 'include',
      });
      const data = await res.json();
      setLists(data);
      setLoading(false);
    }

    fetchLists();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/reading-lists/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const newList = await res.json();
      setLists([...lists, newList]);
      setName('');
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">📚 My Reading Lists</h2>

      <form onSubmit={handleSubmit} className="space-x-2">
        <input
          type="text"
          placeholder="New list name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add List
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2 mt-6">
          {lists.map((list) => (
            <li key={list.id}>
              <Link
                to={`/reading-lists/${list.id}`}
                className="block p-3 bg-gray-100 rounded shadow hover:bg-gray-200 transition"
              >
                {list.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
