import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCSRFToken } from '../utils/csrfToken';

export default function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMeetings() {
      const res = await fetch('http://localhost:8000/api/meetings/', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setMeetings(data);
      } else {
        navigate('/login'); // Not logged in, redirect to login
      }
    }

    fetchMeetings();
  }, [navigate]);

  const handleCreateMeeting = async () => {
    const newMeeting = {
      title: 'New Book Club Meeting',
      description: 'Discussing a new book',
      date: new Date().toISOString(),
      book: 1, // book ID for the meeting
    };

    const res = await fetch('http://localhost:8000/api/meetings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify(newMeeting),
    });

    if (res.ok) {
      const createdMeeting = await res.json();
      setMeetings((prevMeetings) => [...prevMeetings, createdMeeting]);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Upcoming Book Club Meetings</h1>
      <Link to='/meetings/create' className="mb-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md">
        Create New Meeting
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
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
      </div>
    </div>
  );
}
