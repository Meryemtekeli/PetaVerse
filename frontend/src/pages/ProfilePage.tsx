import React, { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

const ProfilePage: React.FC = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDisplayName(user?.displayName || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (user) {
        if (displayName !== user.displayName) {
          await updateProfile(user, { displayName });
        }
        if (email !== user.email) {
          await updateEmail(user, email);
        }
        if (password) {
          await updatePassword(user, password);
        }
        setMessage("Profil başarıyla güncellendi!");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Profilim</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Yeni Şifre</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Şifreyi değiştirmek istemiyorsan boş bırak"
          />
        </div>
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;