import React, { useEffect, useState, useRef } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../services/firebase";

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: any;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(msgs);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    await addDoc(collection(db, "messages"), {
      userId: user.uid,
      username: user.displayName || user.email,
      text,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow flex flex-col h-[70vh]">
      <h2 className="text-xl font-bold mb-4">Sohbet</h2>
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-2">
        {messages.map(m => (
          <div key={m.id} className={`mb-2 flex ${m.userId === user?.uid ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-xs ${m.userId === user?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
              <div className="text-xs font-semibold mb-1">{m.username}</div>
              <div>{m.text}</div>
              <div className="text-[10px] text-gray-300 mt-1 text-right">{m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString() : ''}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Mesaj yaz..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Gönder</button>
      </form>
    </div>
  );
};

export default ChatPage;