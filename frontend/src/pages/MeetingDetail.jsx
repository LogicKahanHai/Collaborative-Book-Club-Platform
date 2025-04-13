import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCSRFToken } from '../utils/csrfToken';

export default function MeetingDetail() {
  const [meeting, setMeeting] = useState(null);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMeeting() {
      const res = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setMeeting(data);
        setHasRSVPed(data.participants.includes(data.created_by));
      } else {
        navigate('/login'); // Not logged in, redirect to login
      }
    }

    fetchMeeting();
  }, [id, navigate]);

  const handleRSVP = async () => {
    const res = await fetch(`http://localhost:8000/api/meetings/${id}/`, {
      method: hasRSVPed ? 'DELETE' : 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        participants: hasRSVPed ? [] : [/* current user ID */],
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
