"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // Send code to backend to get access token
      fetch(`http://localhost:8000/auth/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("OAuth response:", data);
          // Save token to localStorage for persistence (optional)
          localStorage.setItem("access_token", data.token?.access_token || "");
          // Redirect to home
          router.push("/");
        });
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  return <div>Logging you in...</div>;
}

