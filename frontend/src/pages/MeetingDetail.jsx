import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCSRFToken } from '../utils/csrfToken';

export default function MeetingDetail() {
  const [meeting, setMeeting] = useState(null);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMeeting() {
      const res = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setMeeting(data);
        fetchUser().then((userLog => {
          if (userLog.id && data) {
            setHasRSVPed(meeting.participants.includes(userLog.id));
          }
        }));
      } else {
        navigate('/login'); // Not logged in, redirect to login
      }
    }

    async function fetchUser() {
      const res = await fetch('http://localhost:8000/api/user/', {
        credentials: 'include',
      });

      if (res.ok) {
        return await res.json();
      }
    }

    fetchMeeting();


  }, [id, navigate]);

  const handleRSVP = async () => {

    if (!meeting) return;

    const participants = meeting.participants || [];

    const userRes = await fetch('http://localhost:8000/api/user/', {
      credentials: 'include',
    });

    let data
    if (userRes.ok) {
      data = await userRes.json();
    }

    if (hasRSVPed) {
      console.log('Removing user from participants');
      participants.splice(participants.indexOf(data.id), 1);
    } else {

      console.log('Adding user to participants', data);
      participants.push(data.id);
    }

    const res = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
      method: hasRSVPed ? 'DELETE' : 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        participants: participants,
      }),
    });

    if (res.ok) {
      setHasRSVPed(!hasRSVPed);
    }
  };

  if (!meeting) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg max-w-3xl">
      <h1 className="text-3xl font-semibold text-blue-600">{meeting.title}</h1>
      <p className="text-gray-700 mt-4">{meeting.description}</p>
      <p className="text-gray-500 mt-2">
        <strong>Date:</strong> {new Date(meeting.date).toLocaleString()}
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Participants ({meeting.participants.length})</h3>
        <ul className="mt-2">
          {meeting.participants.map((participant) => (
            <li key={participant.id} className="text-gray-700">
              {participant.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleRSVP}
          className={`px-6 py-2 rounded-lg text-white ${hasRSVPed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
        >
          {hasRSVPed ? 'Leave Meeting' : 'Join Meeting'}
        </button>
        <button
          onClick={() => navigate('/meetings')}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
        >
          Back to Meetings
        </button>
      </div>
    </div>
  );
}
