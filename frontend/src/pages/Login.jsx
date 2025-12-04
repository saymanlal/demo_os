import React, { useState } from "react";
import api, { setAuthToken } from "../api";

export default function Login() {
  const [creds, setCreds] = useState({ username: "", password: "" });

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/token/", creds);
      setAuthToken(res.data.access);
      alert("Logged in");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="username" value={creds.username} onChange={e=>setCreds({...creds,username:e.target.value})} />
        <br/>
        <input placeholder="password" type="password" value={creds.password} onChange={e=>setCreds({...creds,password:e.target.value})} />
        <br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
