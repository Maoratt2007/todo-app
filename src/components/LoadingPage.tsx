// src/LoadPage.tsx
import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function LoadPage() {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // מונע ריצה כפולה ב-StrictMode/HMR
    didRun.current = true;

    (async () => {
      try {
        // נותן ל-SDK לקרוא את ה-hash (#access_token/#refresh_token) ולשמור סשן
        const { data: { session } } = await supabase.auth.getSession();

        // לנקות את ה-URL מה-hash רק אחרי שה-SDK קרא אותו
        if (
          window.location.hash.includes("access_token") ||
          window.location.hash.includes("type=")
        ) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // ניווט בלי setState — לא יהיו "callback is no longer runnable"
        window.location.replace(session ? "/" : "/login");
      } catch {
        // בנפילות לא צפויות: נקה URL ועבור למסך התחברות
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.replace("/login");
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}>
      <h1>Connecting…</h1>
    </div>
  );
}
