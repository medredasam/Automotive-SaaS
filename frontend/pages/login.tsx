import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "../lib/api";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // reset error

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      // ✅ Prepare form data
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      // ✅ Call login API
      const { data } = await api.post("/auth/login", params);

      // ✅ Save JWT to localStorage
      localStorage.setItem("token", data.access_token);

      // ✅ Fetch user role after login
      const meRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      const role = meRes.data.role;
      localStorage.setItem("role", role);

      // ✅ Redirect based on role
      if (role === "client") {
        router.push("/client-dashboard");
      } else if (role === "workshop") {
        router.push("/workshop-dashboard");
      } else {
        router.push("/dashboard"); // fallback
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Login failed — please check your credentials."
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            className="border p-2 rounded"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}

