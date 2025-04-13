
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BookDiscussion from './BookDiscussion';



function ReviewSection({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/reviews/?book=${bookId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        const userReview = data.find((r) => r.user === localStorage.getItem('username'));
        if (userReview) {
          setHasReviewed(true);
          setRating(userReview.rating);
          setText(userReview.text);
        }
      });
  }, [bookId]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/reviews/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
      body: JSON.stringify({ book: bookId, rating, text }),
    });

    if (res.ok) {
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setHasReviewed(true);
    } else {
      alert('You may have already reviewed this book.');
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Reviews</h2>

      {!hasReviewed && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-2">
            <label className="block font-medium mb-1">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="border p-1 rounded"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 && 's'}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded p-2 mb-2"
            rows={3}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Submit Review
          </button>
        </form>
      )}

      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((rev) => (
        <div key={rev.id} className="border-t py-3">
          <p className="font-semibold">{rev.user} rated it {rev.rating} ⭐</p>
          {rev.text && <p className="text-gray-700">{rev.text}</p>}
        </div>
      ))}
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/books/${id}/`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch book');
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching book:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="mt-10 text-center">Loading book...</p>;

  if (!book) return <p className="mt-10 text-center text-red-600">Book not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">

      <Link to="/books" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Library
      </Link>
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-600 mb-4">by {book.author}</p>

      {book.description && (
        <p className="mb-6 text-gray-800 leading-relaxed">{book.description}</p>
      )}


      <ReviewSection bookId={book.id} />

      {/* 🔥 Drop in the discussion section */}
      <BookDiscussion bookId={book.id} />
    </div>
  );
}
