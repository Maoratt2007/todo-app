import {supabase} from '../lib/supabase.ts';
export default function TodoPage(){
    return(
        <div style={{ maxWidth: 560, margin: "60px auto", display: "grid", gap: 16 }}>
            <h1>Todos</h1>
            <p>welcome to your missions!</p>
            <button onClick={async ()=>{await supabase.auth.signOut();}} 
                    style={{ padding: 10, borderRadius: 8, border: "1px solid #999", cursor: "pointer", width: 160 }}>
                        Log out
            </button>
        </div>
    )
}