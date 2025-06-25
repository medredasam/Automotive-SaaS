import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../lib/api"; // your Axios client

export default function Register() {
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "workshop">("client");

  // Error message
  const [error, setError] = useState("");

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!username || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setError("");

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
        role,
      });
      router.push("/login"); // redirect on success
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Error during registration. Please try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <input
            className="border p-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value as "client" | "workshop")}
          >
            <option value="client">Client</option>
            <option value="workshop">Workshop</option>
          </select>

          {error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Register
          </button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
