// src/LoadPage.tsx
import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function LoadPage() {
  const didRun = useRef(false);//valuable that dont render when he changed 

  useEffect(() => {
    if (didRun.current) return; // avoid two useEffect run from strictMode in react(this is a problem redirect two times 401 problem)
    didRun.current = true;

    (async () => {
      try {
        // get the session
        const { data: { session } } = await supabase.auth.getSession();

        //clear the paramaters in the url-avoid sdk saves again and again session(if I will open new page with the 
        // same url I will get new session and then if I return to the url with the old session I will get error 401), and security
        if (
          window.location.hash.includes("access_token") ||
          window.location.hash.includes("type=")
        ) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        //if there is a session go to app and he decide todopage or authpage else /login 
        window.location.replace(session ? "/" : "/login");
      } catch {
        // clean the url and back to /login 
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.replace("/login");
      }
    })(); //run this function 
  }, []);

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}>
      <h1>Connecting…</h1>
    </div>
  );
}
