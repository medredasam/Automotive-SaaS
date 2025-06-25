import Link from "next/link";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link href="/" className="font-bold text-xl">AutoSaaS</Link>
      <div className="space-x-4">
        {loggedIn ? (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

