import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login"); // not logged in? redirect
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome to your dashboard 🚀</h1>
      <p className="mt-2">Your JWT is safe in localStorage.</p>
    </main>
  );
}
