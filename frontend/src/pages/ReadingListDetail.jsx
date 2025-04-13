
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ReadingListDetail() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');

  useEffect(() => {
    fetchList();
    fetchBooks();
  }, []);

  const fetchList = async () => {
    const res = await fetch(`http://localhost:8000/api/reading-lists/${id}/`, {
      credentials: 'include',
    });
    const data = await res.json();
    setList(data);
  };

  const fetchBooks = async () => {
    const res = await fetch(`http://localhost:8000/api/books/`, {
      credentials: 'include',
    });
    const data = await res.json();
    setBooks(data);
  };

  const handleAddBook = async () => {
    if (!selectedBookId) return;

    const updatedBooks = [...list.books, selectedBookId];

    await fetch(`http://localhost:8000/api/reading-lists/${id}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ books: updatedBooks }),
    });

    fetchList(); // reload
    setSelectedBookId('');
  };

  const handleRemoveBook = async (bookIdToRemove) => {
    const updatedBooks = list.books.filter((bid) => bid !== bookIdToRemove);

    await fetch(`http://localhost:8000/api/reading-lists/${id}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ books: updatedBooks }),
    });

    fetchList(); // reload
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  if (!list) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{list.name}</h2>

      <h3 className="font-semibold mb-2">📖 Books in this list:</h3>
      <ul className="space-y-1 mb-4">
        {list.books.length === 0 ? (
          <p>No books added yet.</p>
        ) : (
          list.books.map((bookId) => {
            const book = books.find((b) => b.id === bookId);
            return (
              <li key={bookId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{book?.title}</span>
                <button
                  onClick={() => handleRemoveBook(bookId)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            );
          })
        )}
      </ul>

      <div className="flex items-center space-x-2">
        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(Number(e.target.value))}
          className="border p-2 rounded w-full"
        >
          <option value="">Select a book to add</option>
          {books.filter(
            (book) => !list.books.includes(book.id) // Only show books not already in the list
          ).map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddBook}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
