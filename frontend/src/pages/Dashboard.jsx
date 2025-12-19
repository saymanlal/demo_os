import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/")
      .then((res) => setData(res.data))
      .catch(() => {
        localStorage.removeItem("access_token");
        window.location.href = "/auth";
      });
  }, []);

  if (!data) return <h2 className="pt-32 text-center">Loading Dashboard...</h2>;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 px-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="mt-6 space-y-4">
          <p><b>Name:</b> {data.user.name}</p>
          <p><b>Phone:</b> {data.user.phone}</p>
          <p><b>Email:</b> {data.user.email}</p>

          <p><b>Plan:</b> {data.plan.name}</p>
          <p><b>Status:</b> {data.plan.status}</p>
        </div>

        <button
          className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg"
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/auth";
          }}
        >
          Logout
        </button>
      </div>

      <Footer />
    </div>
  );
}
