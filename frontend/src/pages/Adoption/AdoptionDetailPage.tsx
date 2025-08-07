import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAdoptionListing, AdoptionListing } from "../../services/api/adoptionApi";
import { getPet, PetProfile } from "../../services/api/petApi";
import { auth } from "../../services/firebase";

const AdoptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<AdoptionListing | null>(null);
  const [pet, setPet] = useState<PetProfile | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (id) {
      getAdoptionListing(id).then(l => {
        setListing(l);
        if (l.petId) getPet(l.petId).then(setPet);
      });
    }
  }, [id]);

  if (!listing) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{listing.title}</h2>
      <div className="mb-2 text-gray-600">{listing.type === 'adoption' ? 'Sahiplendirme' : 'Çiftleştirme'} ilanı</div>
      <div className="mb-4 text-sm text-gray-500">{new Date(listing.createdAt).toLocaleString()}</div>
      <div className="mb-6">{listing.description}</div>
      {pet && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Evcil Hayvan Bilgileri</h3>
          <div className="flex gap-4 items-center">
            <img src={pet.mainImageUrl} alt={pet.name} className="w-24 h-24 object-cover rounded" />
            <div>
              <div className="font-bold">{pet.name}</div>
              <div className="text-gray-600">{pet.type} • {pet.breed} • {pet.age} yaşında</div>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-4">
        {user && user.uid !== listing.ownerId && (
          <button className="btn-primary">Başvuru Yap</button>
        )}
        <Link to="/chat" className="btn-outline">Mesajlaş</Link>
      </div>
    </div>
  );
};

export default AdoptionDetailPage;