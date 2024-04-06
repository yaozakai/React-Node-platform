import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/start/start';
import Homepage from './pages/homepage/homepage'; // Import the Homepage component
import './App.css';
import './index.css';
import './css/font.css';

function App() {
  return (
    <Router>
      <main className="bg-sky-100 flex items-center justify-center h-screen">
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/homepage" element={<Homepage />} />
          </Routes>
      </main>
    </Router>
  );
}

export default App;
