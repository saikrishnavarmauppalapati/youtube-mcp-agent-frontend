"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Send code to backend to get access token
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("OAuth response:", data);

          // Save token to localStorage
          if (data.token?.access_token) {
            localStorage.setItem("access_token", data.token.access_token);
          }

          // Redirect to home page
          router.replace("/");
        })
        .catch((err) => {
          console.error("Error in OAuth callback:", err);
          router.replace("/");
        });
    } else {
      // If no code, go back to home
      router.replace("/");
    }
  }, [searchParams, router]);

  return <div>Logging you in, please wait...</div>;
}

// Wrap in Suspense for Vercel/Next.js CSR requirement
export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Processing login...</div>}>
      <OAuthCallbackPage />
    </Suspense>
  );
}
