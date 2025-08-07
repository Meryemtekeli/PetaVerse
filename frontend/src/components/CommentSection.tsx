import React, { useEffect, useState } from "react";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../services/firebase";

interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  rating: number;
  createdAt: any;
}

interface CommentSectionProps {
  contentId: string; // Yorum yapılan içeriğin (ör: ilan) ID'si
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, "comments"), where("contentId", "==", contentId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[];
      setComments(comms.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });
    return () => unsubscribe();
  }, [contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "comments"), {
      contentId,
      userId: user.uid,
      username: user.displayName || user.email,
      text,
      rating,
      createdAt: serverTimestamp(),
    });
    setText("");
    setRating(5);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Yorumlar</h3>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Yorumunuzu yazın..."
          required
        />
        <div className="flex items-center gap-2">
          <span>Puan:</span>
          <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button type="submit" className="ml-auto bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">Gönder</button>
        </div>
      </form>
      <div className="space-y-4">
        {comments.length === 0 && <div className="text-gray-500">Henüz yorum yok.</div>}
        {comments.map(c => (
          <div key={c.id} className="border rounded p-3 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{c.username}</span>
              <span className="text-yellow-500">{'★'.repeat(c.rating)}{'☆'.repeat(5-c.rating)}</span>
              <span className="text-xs text-gray-400 ml-auto">{new Date(c.createdAt?.seconds * 1000).toLocaleString()}</span>
            </div>
            <div>{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;