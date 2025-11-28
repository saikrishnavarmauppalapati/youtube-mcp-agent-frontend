"use client"; // important: ensures this runs only on the client

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Call your deployed backend, not localhost
      fetch(`https://mcp-youtube-agent-xw94.onrender.com/auth/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("access_token", data.token?.access_token || "");
          router.push("/"); // redirect to home after login
        });
    } else {
      router.push("/"); // if no code, go back home
    }
  }, [searchParams, router]);

  return <div>Logging you in...</div>;
}
