import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Books from './pages/Books';
import Dashboard from './pages/Dashboard';
import ReadingLists from './pages/ReadingList';
import ReadingListDetail from './pages/ReadingListDetail';
import BookDetail from './pages/BookDetail';
import MeetingList from './pages/MeetingList';
import MeetingDetail from './pages/MeetingDetail';
import CreateMeeting from './pages/CreateMeeting';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reading-lists" element={<ReadingLists />} />
        <Route path="/reading-lists/:id" element={<ReadingListDetail />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/meetings" element={<MeetingList />} />
        <Route path="/meetings/:id" element={<MeetingDetail />} />
        <Route path="/meetings/create" element={<CreateMeeting />} />
      </Routes>
    </div>
  );
}
