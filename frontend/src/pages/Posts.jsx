import React, { useEffect, useState } from "react";
import api from "../api";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts/").then(res => setPosts(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(p => (
          <li key={p.id}><strong>{p.title}</strong> — {p.owner} <div>{p.body}</div></li>
        ))}
      </ul>
    </div>
  );
}

