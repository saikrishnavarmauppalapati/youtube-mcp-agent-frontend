"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const rawCode = searchParams.get("code");

    // If code is missing, redirect immediately
    if (!rawCode) {
      router.replace("/");
      return;
    }

    // Safe encode (rawCode is now guaranteed to be string)
    const code = encodeURIComponent(rawCode);

    async function handleOAuth() {
      try {
        const res = await fetch(
          `https://mcp-youtube-agent-xw94.onrender.com/auth/callback?code=${code}`
        );

        const data = await res.json();

        if (data.token?.access_token) {
          localStorage.setItem("access_token", data.token.access_token);
        }

        router.replace("/");
      } catch (err) {
        console.error("OAuth callback error:", err);
        router.replace("/");
      }
    }

    handleOAuth();
  }, [searchParams, router]);

  return <div>Logging you in, please wait...</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Processing login...</div>}>
      <OAuthCallbackPage />
    </Suspense>
  );
}
