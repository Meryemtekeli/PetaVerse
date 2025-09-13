import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLostPetReport, LostPet } from "../../services/api/lostPetApi";
import { auth } from "../../services/firebase";
import { GoogleMapComponent } from "../../components/Maps/GoogleMapComponent";

const LostPetCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [lostPet, setLostPet] = useState<Partial<LostPet>>({
    ownerId: user?.uid || "",
    petName: "",
    petType: "DOG",
    breed: "",
    color: "",
    age: 0,
    gender: "",
    description: "",
    imageUrl: "",
    lostDate: "",
    lostLocation: {
      latitude: 39.925533,
      longitude: 32.866287,
      address: "",
    },
    contactInfo: {
      phone: "",
      email: user?.email || "",
    },
    status: "lost",
    createdAt: new Date().toISOString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLostPet(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (position: { lat: number; lng: number }) => {
    setLostPet(prev => ({
      ...prev,
      lostLocation: {
        ...prev.lostLocation!,
        latitude: position.lat,
        longitude: position.lng
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostPet.petName || !lostPet.lostDate) return;
    await createLostPetReport(lostPet as LostPet);
    navigate("/lost-pets");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Kayıp Hayvan Bildirimi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="petName" value={lostPet.petName} onChange={handleChange} placeholder="Hayvan Adı" className="input" required />
        <select name="petType" value={lostPet.petType} onChange={handleChange} className="input">
          <option value="DOG">Köpek</option>
          <option value="CAT">Kedi</option>
          <option value="BIRD">Kuş</option>
          <option value="OTHER">Diğer</option>
        </select>
        <input name="breed" value={lostPet.breed} onChange={handleChange} placeholder="Irk" className="input" />
        <input name="color" value={lostPet.color} onChange={handleChange} placeholder="Renk" className="input" />
        <input name="age" type="number" value={lostPet.age} onChange={handleChange} placeholder="Yaş" className="input" />
        <input name="gender" value={lostPet.gender} onChange={handleChange} placeholder="Cinsiyet" className="input" />
        <textarea name="description" value={lostPet.description} onChange={handleChange} placeholder="Açıklama" className="input" />
        <input name="imageUrl" value={lostPet.imageUrl} onChange={handleChange} placeholder="Fotoğraf URL" className="input" />
        <input name="lostDate" type="date" value={lostPet.lostDate} onChange={handleChange} className="input" required />
        
        {/* Location Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Kaybolduğu Konum</label>
          <input 
            name="lostLocation.address" 
            value={lostPet.lostLocation?.address} 
            onChange={e => setLostPet(prev => ({ ...prev, lostLocation: { ...prev.lostLocation!, address: e.target.value } }))} 
            placeholder="Kaybolduğu Adres" 
            className="input" 
          />
          <div className="text-sm text-gray-500">
            Haritaya tıklayarak konumu seçin
          </div>
          <div className="h-64 rounded-lg overflow-hidden border">
            <GoogleMapComponent
              center={{ lat: lostPet.lostLocation?.latitude || 39.925533, lng: lostPet.lostLocation?.longitude || 32.866287 }}
              zoom={15}
              markers={[]}
              onMapClick={handleLocationSelect}
              height="100%"
              showControls={true}
            />
          </div>
          {lostPet.lostLocation?.latitude && lostPet.lostLocation?.longitude && (
            <div className="text-sm text-green-600">
              ✓ Konum seçildi: {lostPet.lostLocation.latitude.toFixed(6)}, {lostPet.lostLocation.longitude.toFixed(6)}
            </div>
          )}
        </div>
        <input name="contactInfo.phone" value={lostPet.contactInfo?.phone} onChange={e => setLostPet(prev => ({ ...prev, contactInfo: { ...prev.contactInfo!, phone: e.target.value } }))} placeholder="Telefon" className="input" />
        <input name="contactInfo.email" value={lostPet.contactInfo?.email} onChange={e => setLostPet(prev => ({ ...prev, contactInfo: { ...prev.contactInfo!, email: e.target.value } }))} placeholder="E-posta" className="input" />
        <button type="submit" className="btn-primary w-full">Bildirimi Oluştur</button>
      </form>
    </div>
  );
};

export default LostPetCreatePage; 