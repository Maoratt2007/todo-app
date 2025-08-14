import {useEffect,useState} from "react";
import {supabase} from '../lib/supabase.ts';
export default function LoadPage(){
    //default says that I dont must export that with the name of the function without {} and I can to do default one time in file

    const[status,setStatus]=useState<"pending"|"ok"|"error">("pending");
    const[message,setMessage]=useState("connecting...")

    useEffect(()=>{
        //useEffct its function that we can decide when we want to run, one time(when the page load in the first time)[], when any variable chaged [email(type state)], any render so we dont write anything in the second field
        (async ()=>{
            try{
                const {error}=await supabase.auth.exchangeCodeForSession(window.location.href);
                if (error) throw error;
                setStatus("ok");
                setMessage("Connected succed, loading todo page");
                setTimeout(() => window.location.replace("/"), 400);//wait 400 milisecond(effect of loading) and then go to /todo
            }catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "There is an error in the connection";
                setStatus("error");
                setMessage(msg);
            }
        })();//replace give the function name and then make name_function();
    },[]);//say that in one render this effect will run then no 

    return (
        <div style={{maxWidth: 420, margin: "80px auto", textAlign: "center"}}>
          <h1 style={{marginBottom: 12}}>Welcome</h1>
          <p aria-live="polite" style={{color: status === "error" ? "crimson" : "#333"}}>
            {/* aria-live: allows screen readers to announce changes in this element's content automatically */}
            {message}
          </p>
          {status === "error" && (
            <button
              onClick={() => (window.location.href = "/")}
              style={{marginTop: 16, padding: 10, borderRadius: 8, border: "1px solid #999"}}
            >
              Back to the login page
            </button>
          )}
        </div>
      );
    

}
