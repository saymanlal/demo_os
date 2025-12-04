import React, { useState } from "react";
import api, { setAuthToken } from "../api";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", body: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/posts/", form);
      alert("Created: " + res.data.title);
      setForm({ title: "", body: "" });
    } catch (err) {
      console.error(err);
      alert("Error: you might not be logged in.");
    }
  }

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <br/>
        <textarea placeholder="body" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
        <br/>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
