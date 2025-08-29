import { Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Register from './Register.jsx';

function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default RouterApp;
