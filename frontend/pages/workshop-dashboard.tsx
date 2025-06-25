import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "../utils/auth";

export default function WorkshopDashboard() {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, []);
  return <h1>🛠️ Welcome Workshop — here’s your workshop dashboard</h1>;
}
