import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdoptionListings, AdoptionListing } from "../../services/api/adoptionApi";

const AdoptionListingsPage: React.FC = () => {
  const [listings, setListings] = useState<AdoptionListing[]>([]);
  const [type, setType] = useState<string>("");

  useEffect(() => {
    getAdoptionListings(type as any).then(setListings);
  }, [type]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Sahiplendirme & Çiftleştirme İlanları</h2>
      <div className="mb-4 flex gap-2">
        <select value={type} onChange={e => setType(e.target.value)} className="input w-48">
          <option value="">Tümü</option>
          <option value="adoption">Sahiplendirme</option>
          <option value="breeding">Çiftleştirme</option>
        </select>
        <Link to="/adoption/create" className="btn-primary ml-auto">Yeni İlan Oluştur</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map(listing => (
          <Link key={listing.id} to={`/adoption/${listing.id}`} className="block bg-white rounded shadow p-4 hover:shadow-lg transition">
            <div className="font-bold text-lg mb-1">{listing.title}</div>
            <div className="text-gray-600 mb-2">{listing.type === 'adoption' ? 'Sahiplendirme' : 'Çiftleştirme'}</div>
            <div className="text-sm text-gray-500">{listing.description?.slice(0, 80)}...</div>
            <div className="text-xs text-gray-400 mt-2">{new Date(listing.createdAt).toLocaleString()}</div>
          </Link>
        ))}
        {listings.length === 0 && <div className="text-gray-500 col-span-2">Hiç ilan yok.</div>}
      </div>
    </div>
  );
};

export default AdoptionListingsPage; 