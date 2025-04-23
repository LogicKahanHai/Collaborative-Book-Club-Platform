import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCSRFToken } from '../utils/csrfToken';

export default function CreateMeeting() {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    book: '',
    meetingLink: '',
  });

  // Fetch books for dropdown
  useEffect(() => {
    console.log('Fetching books...');
    fetch('http://localhost:8000/api/books/', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setBooks(data));

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    fetch('http://localhost:8000/api/user/', { credentials: 'include' }).then((res) => {
      if (res.ok) {
        console.log('User is logged in');
        return res.json();
      } else {
        navigate('/login'); // Not logged in, redirect to login
      }
    }).then((data) => {
      setUser(data);
    })

    const res = await fetch('http://localhost:8000/api/meetings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify({ ...formData, participants: [], created_by_id: user.id }),
    });

    if (res.ok) {
      const data = await res.json();
      navigate(`/meetings/${data.id}`);
    } else {
      const error = await res.json();
      console.error('Failed to create meeting:', error);
      alert('Error creating meeting');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-6">📅 Create a New Meeting</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* <input type="hidden" name="creadted_by_id" value={user.id} /> */}

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full border border-gray-300 p-2 rounded"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            className="w-full border border-gray-300 p-2 rounded"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            required
            className="w-full border border-gray-300 p-2 rounded"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Book</label>
          <select
            name="book"
            required
            className="w-full border border-gray-300 p-2 rounded"
            value={formData.book}
            onChange={handleChange}
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Meeting Link (optional)</label>
          <input
            type="url"
            name="meeting_link"
            className="w-full border border-gray-300 p-2 rounded"
            value={formData.meetingLink}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Meeting
          </button>
        </div>
      </form>
    </div>
  );
}
