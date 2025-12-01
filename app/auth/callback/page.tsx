"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/");
      return;
    }

    async function completeOAuth() {
      try {
        // send auth code to backend which will exchange for access_token
        const res = await fetch(
          `https://mcp-youtube-agent-xw94.onrender.com/auth/callback?code=${encodeURIComponent(code)}`
        );
        const data = await res.json();

        if (data.token?.access_token) {
          // save token to localStorage for future calls from frontend
          localStorage.setItem("access_token", data.token.access_token);
        }

        // navigate home
        router.replace("/");
      } catch (err) {
        console.error("OAuth callback error:", err);
        router.replace("/");
      }
    }

    completeOAuth();
  }, [searchParams, router]);

  return <div className="p-6">Logging you in... please wait.</div>;
}
