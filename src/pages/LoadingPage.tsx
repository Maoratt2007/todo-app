// src/LoadPage.tsx
import { useEffect, useRef,useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoadPage() {
  const didRun = useRef(false);//valuable that dont render when he changed 
  const [err, setErr] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);//flag to if we have session or not yet

  useEffect(() => {
    if (didRun.current) return; // avoid two useEffect run from strictMode in react
    // (this is a problem redirect two times+imagine in the second run I revert to /login so window.location wrong)
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
        if (session) {
          //if already connected we dont want open new page with todopage
          setSignedIn(true);
        } else {
          // if not connected back to login
          window.location.replace("/login");
        }
      } catch(e) {
        // clean the url and back to /login 
        window.history.replaceState({}, document.title, window.location.pathname);
        setErr(e instanceof Error ? e.message : "Unexpected error");//if there is an error use it else write "Unexpected error"
      }
    })(); //run this function 
  }, []);

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", textAlign: "center" }}>
      {err ? (
        <>
          <h1 style={{ color: "crimson" }}>There is an error</h1>
          <p>{err}</p>
          <p><a href="/login">back to login page</a></p>
        </>
      ) : signedIn ? (
        <>
          <h1>The todopage already opened </h1>
          <p>Back to your first tab that opened </p>
        </>
      ) : (
        <h1>Connecting…</h1>
      )}
    </div>
  );

}
