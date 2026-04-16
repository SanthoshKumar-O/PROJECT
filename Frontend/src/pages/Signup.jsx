import { useState } from "react";
import API from "../api";

function Signup() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("User Created", res.data);
      alert("User Created Successfully 👍🏻");

    } catch (err) {
  console.log("ERROR FULL:", err);
  console.log("ERROR DATA:", err.response?.data);
  setError(JSON.stringify(err.response?.data));
}
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h1 className="text-2xl font-bold text-gray-800">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Start managing your projects
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />

          <input
            name="email"
            placeholder="Email Address"
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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button type="submit" 
          className="w-24 bg-blue-400 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus: ring-blue-500 hover:bg-blue-500 transform hover:-translate-y-1 hover:scale-110 transition duration-300 ease-in-out">
            Signup
            </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;