
import { useEffect, useState } from 'react';

export default function BookDiscussion({ bookId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/discussions/?book=${bookId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/discussions/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ book: bookId, text }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([...comments, newComment]);
      setText('');
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  return (
    <div className="mt-8 p-4 border rounded bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">💬 Book Discussions</h3>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No discussions yet. Be the first to comment!</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {comments.map((c) => (
            <li key={c.id} className="p-2 border rounded bg-gray-100">
              <strong>{c.user}</strong>
              <p>{c.text}</p>
              <small className="text-gray-500">{new Date(c.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="3"
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="self-end bg-blue-600 text-white px-4 py-2 rounded">
          Post Comment
        </button>
      </form>
    </div>
  );
}
