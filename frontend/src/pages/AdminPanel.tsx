import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getAdoptionListings } from "../services/api/adoptionApi";
import { getApplicationsByListing } from "../services/api/applicationApi";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const usersSnap = await getDocs(collection(db, "users"));
      const commentsSnap = await getDocs(collection(db, "comments"));
      const listingsData = await getAdoptionListings();
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setComments(commentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setListings(listingsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter(u => u.id !== id));
  };

  const handleDeleteComment = async (id: string) => {
    await deleteDoc(doc(db, "comments", id));
    setComments(comments.filter(c => c.id !== id));
  };

  const handleApproveListing = async (id: string) => {
    await updateDoc(doc(db, "adoptionListings", id), { status: "active" });
    setListings(listings.map(l => l.id === id ? { ...l, status: "active" } : l));
  };

  const handleRejectListing = async (id: string) => {
    await updateDoc(doc(db, "adoptionListings", id), { status: "closed" });
    setListings(listings.map(l => l.id === id ? { ...l, status: "closed" } : l));
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Paneli</h2>
      
      {/* İlanlar */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">İlanlar (Moderasyon)</h3>
        <table className="w-full mb-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Başlık</th>
              <th className="p-2">Tip</th>
              <th className="p-2">Durum</th>
              <th className="p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(l => (
              <tr key={l.id} className="border-b">
                <td className="p-2">{l.title}</td>
                <td className="p-2">{l.type}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2">
                  {l.status === 'pending' && (
                    <>
                      <button onClick={() => handleApproveListing(l.id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-1">Onayla</button>
                      <button onClick={() => handleRejectListing(l.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Reddet</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kullanıcılar */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Kullanıcılar</h3>
        <table className="w-full mb-4 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">E-posta</th>
              <th className="p-2">Rol</th>
              <th className="p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b">
                <td className="p-2 text-xs">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role || 'user'}</td>
                <td className="p-2">
                  <button onClick={() => handleDeleteUser(u.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yorumlar */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Yorumlar</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Kullanıcı</th>
              <th className="p-2">Yorum</th>
              <th className="p-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(c => (
              <tr key={c.id} className="border-b">
                <td className="p-2 text-xs">{c.id}</td>
                <td className="p-2">{c.username}</td>
                <td className="p-2">{c.text}</td>
                <td className="p-2">
                  <button onClick={() => handleDeleteComment(c.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;