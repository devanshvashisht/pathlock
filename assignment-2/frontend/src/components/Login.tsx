import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await api.login(username, password);

    if (res.token) {
      login(res.token);
      navigate("/projects");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
        <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

        <input className="w-full border p-2 mb-3" placeholder="Username"
          onChange={(e) => setUsername(e.target.value)} />

        <input className="w-full border p-2 mb-3" type="password" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
