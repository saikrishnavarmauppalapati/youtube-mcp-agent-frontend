"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      // No code? Go back home
      router.replace("/");
      return;
    }

    async function handleOAuth() {
      try {
        // Send code to backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/callback?code=${code}`
        );

        const data = await res.json();

        // Save token in localStorage
        if (data.token?.access_token) {
          localStorage.setItem("access_token", data.token.access_token);
        }

        // Redirect to home page
        router.replace("/");

      } catch (err) {
        console.error("OAuth callback error:", err);
        router.replace("/"); // fallback to home
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
