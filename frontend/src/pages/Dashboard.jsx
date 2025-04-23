import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [readingList, setReadingList] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, readingListRes, meetingsRes, discussionsRes] = await Promise.all([
          fetch('http://localhost:8000/api/user/', { credentials: 'include' }),
          fetch('http://localhost:8000/api/reading-lists/', { credentials: 'include' }),
          fetch('http://localhost:8000/api/meetings/', { credentials: 'include' }),
          fetch('http://localhost:8000/api/books/recent-comments/', { credentials: 'include' }),
        ]);

        console.log(userRes, readingListRes, meetingsRes, discussionsRes);

        const [userData, readingListData, meetingsData, discussionsData] = await Promise.all([
          userRes.json(),
          readingListRes.json(),
          meetingsRes.json(),
          discussionsRes.json(),
        ]);

        setUser(userData);
        setReadingList(readingListData);
        setMeetings(meetingsData);
        setDiscussions(discussionsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow space-y-8">
      <h1 className="text-3xl font-bold">👋 Welcome, {user.username}</h1>

      {/* Reading List */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📖 Your Reading List</h2>
        {readingList.length > 0 ? (
          <ul className="list-disc list-inside">
            {readingList.map(list => (
              <li key={list.id} className="p-4">
                <Link to={`/reading-lists/${list.id}`} className="font-semibold hover:underline">
                  {list.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Your list is empty.</p>
        )}
      </section>

      {/* Meetings */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📅 Upcoming Meetings</h2>
        {meetings.length > 0 ? (
          <ul className="space-y-2">
            {meetings.map(meeting => (
              <div key={meeting.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-semibold text-blue-600">{meeting.title}</h3>
                <p className="text-gray-700 mt-2">{meeting.description}</p>
                <p className="text-gray-500 mt-2">
                  <strong>Date:</strong> {new Date(meeting.date).toLocaleString()}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => navigate(`/meetings/${meeting.id}`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No meetings scheduled.</p>
        )}
      </section>

      {/* Discussions */}
      {/* <section> */}
      {/*   <h2 className="text-xl font-semibold mb-2">💬 Recent Discussions</h2> */}
      {/*   {discussions.length > 0 ? ( */}
      {/*     <ul className="space-y-2"> */}
      {/*       {discussions.map(comment => ( */}
      {/*         <li key={comment.id}> */}
      {/*           <strong>{comment.user.username}</strong> on <em>{comment.book.title}</em>:<br /> */}
      {/*           "{comment.content}" */}
      {/*         </li> */}
      {/*       ))} */}
      {/*     </ul> */}
      {/*   ) : ( */}
      {/*     <p className="text-gray-500">No recent comments.</p> */}
      {/*   )} */}
      {/* </section> */}
    </div>
  );
}
