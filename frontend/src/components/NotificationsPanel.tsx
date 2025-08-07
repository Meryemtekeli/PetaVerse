import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../services/firebase";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: any;
  read: boolean;
}

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Notification[];
      setNotifications(notifs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });
    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notifId: string) => {
    await updateDoc(doc(db, "notifications", notifId), { read: true });
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
      <h3 className="px-4 py-2 font-bold border-b">Bildirimler</h3>
      {notifications.length === 0 && (
        <div className="px-4 py-6 text-gray-500 text-center">Hiç bildiriminiz yok.</div>
      )}
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-4 py-3 border-b cursor-pointer ${notif.read ? "bg-gray-50" : "bg-blue-50 font-semibold"}`}
          onClick={() => markAsRead(notif.id)}
        >
          <div className="text-sm">{notif.title}</div>
          <div className="text-xs text-gray-600">{notif.message}</div>
          <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt?.seconds * 1000).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;