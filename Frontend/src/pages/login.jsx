import { useState } from "react";
import API from "../api";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/token/", {
        username: formData.username,
        password: formData.password,
      });

      console.log("LOGIN SUCCESS:", res.data);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login successful 🚀");
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h1 className="text-2xl font-bold text-gray-800">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Login into Your Account
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
          >
            Login
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Don't have an Account? 
            <span
    className="text-blue-500 cursor-pointer ml-3"
    onClick={() => navigate("/signup")}>
        Signup
        </span>
    </p>
          

        </form>

      </div>
    </div>
  );
}

export default Login;