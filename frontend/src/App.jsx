import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav>
        <Link to="/">Posts</Link> | <Link to="/create">Create</Link> | <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
