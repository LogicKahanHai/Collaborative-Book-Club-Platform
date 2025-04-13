import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/books/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6">📚 Book Club Library</h1>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="p-4 border rounded shadow">
              <Link to={`/books/${book.id}`} className="text-xl font-semibold hover:underline">
                {book.title}
              </Link>
              <p className="text-gray-600">{book.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
