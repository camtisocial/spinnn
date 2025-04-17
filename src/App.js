import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPost from './pages/Blog.jsx';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="posts/:slug" element={<BlogPost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
