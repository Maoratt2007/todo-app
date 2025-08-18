import React, { useState, useEffect } from 'react'; //we want render again and again after we chagne any value ,we want to see it in the screen directly
import {supabase} from '../lib/supabase.ts';
//define the "Todo" type for get the rows from the database to object
type Todo = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    due_date: string | null;            
    priority: "low" | "med" | "high";
    completed: boolean;
    created_at: string;
    updated_at?: string;//option-no need fill this field
  };
  
export default function TodoPage(){
    const[todos,setTodos]=useState<Todo[]>([]);//we want define an array that gets and contains all the rows of missions
    const[loading,setLoading]=useState(false);//says if we are in process get the missions from our supabase
    const[err,setErr]=useState<string|null>(null);//if we have any problem in this process...

    //states for the errors
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [dueDate, setDue] = useState("");
    const [priority, setPrio] = useState<"low" | "med" | "high">("low");

    const [adding, setAdding] = useState(false); //if we tapped on add button we want to do him unable(prevents add many times same mission)

    //function that takes from the supabase the missions of the customer
    async function load(){
        setLoading(true);
        setErr(null);
        const {data,error}=await supabase.from("todos").select("*").order("created_at", { ascending: true });//ascending- its paramater of order that says "sort from the small to big"+the RLS works here so we will get only our missions
        if(error){
            setErr(error.message);
        }
        else{
            setTodos((data ?? []) as Todo[]); //if data(what we got from the supabase) is null we return [] else we put the data in the todos+we do casting from data(unknown type) to Todo[] type
        }
        setLoading(false);
    }

    useEffect(() => { load(); }, []); //in the first render it runs this useEffect(load)

    async function addTodo(e: React.FormEvent){
        e.preventDefault();//prevents new render that causes to reset states, we dont see our prev missions 
        if(!title.trim()){
            //if title is null
            alert("Title is required");
            return; 
        }
        setAdding(true);
        setErr(null);
        //build object to insert
        const { data: u } = await supabase.auth.getUser();//get the connected customer from the supabase function that deals with the session+we changed the name from data to u
        if (!u?.user){ 
          //if u exist(not null|undefined) go to u.user else return undefined- you checked in this if two things-1.u exist 2. u.user exist
           setErr("Not signed in");
           return; 
          }
        const mission = {
            user_id:u.user.id,
            title: title.trim(),
            description: description.trim() || null, //description will be null if we dont give hm a value
            due_date: dueDate || null,
            priority,
          };
        const{data,error}=await supabase.from("todos").insert([mission]).select().single();//.select().single() give me the row that inserted
        if (error){
            setErr(error.message);
        }
        else {
          setTodos((prev) => [data as Todo, ...prev]);//we use in prev(the list of rows that we had ) and create new array with the data first and then all the prev missions 
          setTitle("");
          setDesc(""); 
          setDue(""); 
          setPrio("low");
        }
        setAdding(false);//finish with add- change the button from adding... to add
    }

    //delete 
    async function remove(id: string){
        const { error } = await supabase.from("todos").delete().eq("id", id);//delete from the supabase the mission
        if (error) { setErr(error.message); return; }
        setTodos((prev) => prev.filter((t) => t.id !== id));//delete from the array(screen)+filter scan all the missions and remain all the missions without the mission we want to delete 
    }
    //update 
    async function toggleCompleted(id:string,next:boolean){
        //next its the new value for the isComplete field (he will get it from the input e.target.checked )
        const { data, error } = await supabase
        .from("todos")
        .update({ completed: next })
        .eq("id", id)
        .select()
        .single();//update the compeleted to true in the supabase and return the object we updated
        if (error){ 
            setErr(error.message); 
            return; 
        }
        setTodos((prev) => prev.map((t) => (t.id === id ? (data as Todo) : t)));//change the old object to the new from the object we've got from the select().single()

      }







      return (
        <div style={{ maxWidth: 720, margin: "40px auto", display: "grid", gap: 16 }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Todos</h1>
            <button
              onClick={async () => { await supabase.auth.signOut(); }}
              style={{ padding: 8, borderRadius: 8, border: "1px solid #999", cursor: "pointer", width: 120 }}
            >
              Log out
            </button>
          </header>
      
          {/* Create */}
          <form onSubmit={addTodo} style={{ display: "grid", gap: 8, border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDesc(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}>
              <select value={priority} onChange={(e) => setPrio(e.target.value as any)}>
                <option value="low">low</option>
                <option value="med">med</option>
                <option value="high">high</option>
              </select>
              <input type="date" value={dueDate} onChange={(e) => setDue(e.target.value)} />
              <button type="submit" disabled={adding || !title.trim()} style={{ marginLeft: "auto" }}>
                {adding ? "Adding…" : "Add"}
              </button>
            </div>
          </form>
      
          {loading && <p>Loading…</p>}
          {err && <p style={{ color: "crimson" }}>{err}</p>}
          {!loading && todos.length === 0 && <p style={{ opacity: 0.7 }}>No todos yet. Add your first one above.</p>}
      
          {/* List */}
          <ul style={{ display: "grid", gap: 8, listStyle: "none", padding: 0 }}>
            {/*lifeStyle says without points+we scan all todos array and when we will change something it will do render so it will update in our screen */}
            {todos.map((t) => (
              <li key={t.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 12, display: "grid", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={(e) => toggleCompleted(t.id, e.target.checked)}
                  />

                  {/* strong is say that this text vary important its bold the text and make him important for autoread and  */}
                  <strong>{t.title}</strong>
                  <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.8 }}>
                    {/*toUpperCase() its a function that makes the low letter to big for priority values for example low->LOW(for access) */}
                    {/* if you have any due_date make this • due ${t.due_date} else write nothing("")  */}
                    {t.priority.toUpperCase()} {t.due_date ? `• due ${t.due_date}` : ""} 
                  </span>
                </div>

                {/* shows the description(if there is one) */}
                {t.description && (
                  <div style={{ whiteSpace: "pre-wrap", opacity: 0.9 }}>
                    {t.description}
                  </div>
                )}

                {/* delete button in the list for any task you have this */}
                <div style={{ display: "flex" }}>
                  <button onClick={() => remove(t.id)} style={{ marginLeft: "auto" }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
      
}