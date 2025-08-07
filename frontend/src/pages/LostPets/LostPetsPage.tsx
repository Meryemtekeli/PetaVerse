import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLostPetReports, LostPet } from "../../services/api/lostPetApi";

const LostPetsPage: React.FC = () => {
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    getLostPetReports(status as any).then(setLostPets);
  }, [status]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Kayıp Hayvan Bildirimleri</h2>
      <div className="mb-4 flex gap-2">
        <select value={status} onChange={e => setStatus(e.target.value)} className="input w-48">
          <option value="">Tümü</option>
          <option value="lost">Kayıp</option>
          <option value="found">Bulundu</option>
          <option value="reunited">Birleşti</option>
        </select>
        <Link to="/lost-pets/create" className="btn-primary ml-auto">Yeni Bildirim</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lostPets.map(pet => (
          <Link key={pet.id} to={`/lost-pets/${pet.id}`} className="block bg-white rounded shadow p-4 hover:shadow-lg transition">
            <div className="flex gap-4">
              <img src={pet.imageUrl} alt={pet.petName} className="w-24 h-24 object-cover rounded" />
              <div>
                <div className="font-bold text-lg mb-1">{pet.petName}</div>
                <div className="text-gray-600 mb-2">{pet.petType} • {pet.breed} • {pet.age} yaşında</div>
                <div className="text-sm text-gray-500">{pet.lostLocation.address}</div>
                <div className="text-xs text-gray-400 mt-2">{new Date(pet.lostDate).toLocaleDateString()}</div>
                <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                  pet.status === 'lost' ? 'bg-red-100 text-red-800' :
                  pet.status === 'found' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {pet.status === 'lost' ? 'Kayıp' : pet.status === 'found' ? 'Bulundu' : 'Birleşti'}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {lostPets.length === 0 && <div className="text-gray-500 col-span-2">Hiç bildirim yok.</div>}
      </div>
    </div>
  );
};

export default LostPetsPage; 