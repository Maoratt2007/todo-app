import React, { useState } from 'react'; //we want render again and again after we chagne any value ,we want to see it in the screen directly
import {supabase} from '../lib/supabase';//we want to use the supabase client(the functions of supabase)

export default function AuthPage(){
 const [email,setEmail] = useState('');//we need to store the email in the state to use it in the code
 const [loading, setLoading] = useState(false);//state for if we sent the email or not 
 const [successMsg, setSuccessMsg] = useState<string | null>(null);//we need it to show the message success
 const [errorMsg, setErrorMsg] = useState<string | null>(null);//we need it to show the message error

 //we want to send the magic link to the email
 const handleSubmit=async(e: React.FormEvent)=>{
    e.preventDefault(); // cancel the action of html, usually the html when you do submmit collect all the varibles he has in the form and attached them to the url and do get method 
    
    //reset the state of messages 
    setSuccessMsg(null);
    setErrorMsg(null);
    
    //delete spaces in the start and end of the email
    const value = email.trim(); 

    //if you dont put any email
    if (!value) {
        setErrorMsg("Please enter an email address.");
        return;
    }
    
    //we start our action send a email to the user 
    setLoading(true);

    try {
        const {error}=await supabase.auth.signInWithOtp({
            email: value,
            options: { emailRedirectTo: "http://localhost:5173/todo" } //after he tap on the link in the email he direct to this site url,
        });
        if (error) throw error;
        setSuccessMsg("Magic link sent! Check your inbox.");
      } catch (err: any) {
        setErrorMsg(err?.message || "Something went wrong"); //if there in the error we throw message use it else put the "Something went wrong"
      } finally {
        setLoading(false);//both of the cases(error||sucees) this code run-> this is finally 
      }
    };
    return (
        <div style={{ maxWidth: 380, margin: "60px auto", display: "grid", gap: 10 }}>
          <h1 style={{ marginBottom: 8 }}>Sign in via Magic Link</h1>
    
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email" //This tells the browser: if you know the user’s email from past logins, suggest it here.
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
    
            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #999", cursor: "pointer" }}
            >
              {loading ? "Sending..." : "You have click on send"}
            </button>
          </form>
    
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
          {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}
        </div>
      );

}
 



