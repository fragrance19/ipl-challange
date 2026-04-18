import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDG7JZWz0TRXEw5oTuswU9knegDkN8VDjk",
  authDomain: "ipl-challange-a0243.firebaseapp.com",
  projectId: "ipl-challange-a0243",
  storageBucket: "ipl-challange-a0243.firebasestorage.app",
  messagingSenderId: "11759163897",
  appId: "1:11759163897:web:c8872e2b265430b4630528",
  measurementId: "G-E8R6R105KY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function login() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      alert("Login failed: " + e.message);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !user) return;
    await addDoc(collection(db, "messages"), {
      text: input,
      user: user.displayName,
      avatar: user.displayName?.charAt(0).toUpperCase(),
      timestamp: serverTimestamp()
    });
    setInput("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>

      <div style={{ background: "#c0392b", borderRadius: 12, padding: 16, color: "#fff", marginBottom: 16 }}>
        <div style={{ fontSize: 11, background: "rgba(255,255,255,0.2)", display: "inline-block", padding: "2px 10px", borderRadius: 20, marginBottom: 8 }}>
          LIVE · IPL 2026 · Match 26 · RCB vs DC
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>RCB</div>
            <div style={{ fontSize: 20 }}>187/4</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>20 overs</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>VS</div>
            <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>Chinnaswamy</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>DC</div>
            <div style={{ fontSize: 20 }}>142/6</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>18.2 overs</div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
          ✨ RCB vs DC LIVE at Chinnaswamy! What a match tonight!
        </div>
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>🏏 Fan Room</span>
          {user ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#888" }}>{user.displayName}</span>
              <button onClick={() => signOut(auth)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, border: "1px solid #ddd", cursor: "pointer", background: "none" }}>
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={login} style={{ background: "#c0392b", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
              Sign in with Google
            </button>
          )}
        </div>

        <div style={{ height: 300, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "#fafafa" }}>
          {messages.length === 0 && (
            <div style={{ color: "#aaa", fontSize: 13, textAlign: "center", marginTop: 100 }}>
              Be the first to react to the match! 🎉
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FAECE7", color: "#993C1D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                {m.avatar}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{m.user}</div>
                <div style={{ fontSize: 13, background: "#fff", borderRadius: 8, padding: "6px 10px", border: "1px solid #eee" }}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderTop: "1px solid #eee", display: "flex", gap: 8, background: "#fff" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={user ? "React to the match..." : "Sign in to chat"}
            disabled={!user}
            style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none" }}
          />
          <button
            onClick={sendMessage}
            disabled={!user}
            style={{ background: user ? "#c0392b" : "#ccc", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: user ? "pointer" : "default", fontSize: 13 }}>
            Post
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#aaa" }}>
        Built with Firebase + Gemini · #GoogleCloud #BuildWithAI #GoogleCloudAPL
      </div>

    </div>
  );
}
