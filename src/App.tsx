import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {supabase} from "./lib/supabase"
import AuthPage from './components/AuthPage'
import TodoPage from './components/TodoPage'

type Gate=|{status: "loading"}|{status:"ready"; hasSession:boolean}|{status:"error"; message:string}
// varbile with type Gate can be only loading-check if we have session, 
// ready-we have a session, error-the reason we dont have session is error
export default function App() {
  const [gate,setGate]=useState<Gate>({status:"loading"});
  
  useEffect(()=>{
    let isMounted=true; //for situation that Im in todoPage(the component app delete) but the async function
    //  still run and once I got the session the code continue 
    // to setStatus but because Im in other page this component delete so error
    supabase.auth.getSession().then(({data, error}) => {
      //resolve-> the function getSession succeed 
      if (!isMounted) return; //avoid set state while the component delete(avoid error)
      if (error) {
        setGate({status: "error", message: error.message});
        return;
      }
      setGate({status: "ready", hasSession: !!data.session});
      //!!data.session this value is boolean its a trick in typescript
      //if data.session is empty(null) it returns false else true
    }).catch((err: unknown)=>{
      if(!isMounted) return;//avoid error of change state when component deleted
      const msg= err instanceof Error ? err.message:"error in first connection"
      setGate({status: "error",message: msg});
    });
    const{data:sub}=supabase.auth.onAuthStateChange((_evt,session)=>{
      //_evt is a action that you did(logout,login,refreshsession....)
      if(!isMounted) return;
      setGate({status: "ready", hasSession: !!session})
      //this function return the object that allows us "listening" to actions
    })
    return () => {     
      isMounted = false;
      sub.subscription.unsubscribe();//cancel the listening to actions
     };
  },[])
  
  if (gate.status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p aria-live="polite">loading...</p>
      </div>
    );
  }

  if (gate.status === "error") {
    return (
      <div style={{ maxWidth: 520, margin: "64px auto", textAlign: "center" }}>
        <h1 style={{ marginBottom: 8 }}>error</h1>
        <p aria-live="assertive" style={{ color: "crimson" }}>
          {gate.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 16, padding: 10, borderRadius: 8, border: "1px solid #aaa" }}
        >
           try again
        </button>
      </div>
    );
  }
  
  return gate.hasSession ? <TodoPage /> : <AuthPage />;

}
