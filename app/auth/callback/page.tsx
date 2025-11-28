import { Suspense } from "react";
import OAuthCallback from "./OAuthCallback";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Processing login... Please wait.</div>}>
      <OAuthCallback />
    </Suspense>
  );
}
