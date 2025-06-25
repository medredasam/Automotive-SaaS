import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "../utils/auth";

export default function ClientDashboard() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, []);
  return <h1>👋 Welcome Client — here’s your client dashboard</h1>;
}
