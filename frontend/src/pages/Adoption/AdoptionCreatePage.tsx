import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAdoptionListing, AdoptionListing } from "../../services/api/adoptionApi";
import { getPetsByOwner, PetProfile } from "../../services/api/petApi";
import { auth } from "../../services/firebase";

const AdoptionCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [listing, setListing] = useState<Partial<AdoptionListing>>({
    ownerId: user?.uid || "",
    petId: "",
    type: "adoption",
    title: "",
    description: "",
    status: "pending",
    applicants: [],
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (user?.uid) {
      getPetsByOwner(user.uid).then(setPets);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setListing(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing.petId || !listing.title) return;
    await createAdoptionListing(listing as AdoptionListing);
    navigate("/adoption");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Sahiplendirme / Çiftleştirme İlanı Oluştur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="petId" value={listing.petId} onChange={handleChange} className="input" required>
          <option value="">Evcil Hayvan Seç</option>
          {pets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
          ))}
        </select>
        <select name="type" value={listing.type} onChange={handleChange} className="input">
          <option value="adoption">Sahiplendirme</option>
          <option value="breeding">Çiftleştirme</option>
        </select>
        <input name="title" value={listing.title} onChange={handleChange} placeholder="Başlık" className="input" required />
        <textarea name="description" value={listing.description} onChange={handleChange} placeholder="Açıklama" className="input" />
        <button type="submit" className="btn-primary w-full">İlanı Oluştur</button>
      </form>
    </div>
  );
};

export default AdoptionCreatePage;