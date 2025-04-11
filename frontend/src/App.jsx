import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Books from './pages/Books';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
