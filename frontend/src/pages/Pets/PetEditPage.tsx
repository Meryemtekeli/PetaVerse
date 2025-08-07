import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPet, PetProfile } from "../../services/api/petApi";
import { auth } from "../../services/firebase";

const PetEditPage: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [pet, setPet] = useState<Partial<PetProfile>>({
    ownerId: user?.uid || "",
    name: "",
    type: "DOG",
    breed: "",
    color: "",
    age: 0,
    weight: 0,
    gender: "",
    size: "",
    description: "",
    mainImageUrl: "",
    imageUrls: [],
    videoUrls: [],
    healthRecords: [],
    vaccinationRecords: [],
    memorial: false,
    memorialNote: "",
    createdAt: new Date().toISOString(),
  });
  const [healthDate, setHealthDate] = useState("");
  const [healthType, setHealthType] = useState("");
  const [healthNote, setHealthNote] = useState("");
  const [vaccineDate, setVaccineDate] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineNote, setVaccineNote] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setPet(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const addHealthRecord = () => {
    setPet(prev => ({
      ...prev,
      healthRecords: [...(prev.healthRecords || []), { date: healthDate, type: healthType, note: healthNote }],
    }));
    setHealthDate(""); setHealthType(""); setHealthNote("");
  };

  const addVaccineRecord = () => {
    setPet(prev => ({
      ...prev,
      vaccinationRecords: [...(prev.vaccinationRecords || []), { date: vaccineDate, vaccine: vaccineName, note: vaccineNote }],
    }));
    setVaccineDate(""); setVaccineName(""); setVaccineNote("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet.name || !pet.type) return;
    await createPet(pet as PetProfile);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Evcil Hayvan Profili Oluştur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={pet.name} onChange={handleChange} placeholder="İsim" className="input" required />
        <select name="type" value={pet.type} onChange={handleChange} className="input">
          <option value="DOG">Köpek</option>
          <option value="CAT">Kedi</option>
          <option value="BIRD">Kuş</option>
          <option value="OTHER">Diğer</option>
        </select>
        <input name="breed" value={pet.breed} onChange={handleChange} placeholder="Irk" className="input" />
        <input name="color" value={pet.color} onChange={handleChange} placeholder="Renk" className="input" />
        <input name="age" type="number" value={pet.age} onChange={handleChange} placeholder="Yaş" className="input" />
        <input name="weight" type="number" value={pet.weight} onChange={handleChange} placeholder="Kilo" className="input" />
        <input name="gender" value={pet.gender} onChange={handleChange} placeholder="Cinsiyet" className="input" />
        <input name="size" value={pet.size} onChange={handleChange} placeholder="Boyut" className="input" />
        <textarea name="description" value={pet.description} onChange={handleChange} placeholder="Açıklama" className="input" />
        <input name="mainImageUrl" value={pet.mainImageUrl} onChange={handleChange} placeholder="Ana Fotoğraf URL" className="input" />
        <input name="imageUrls" value={pet.imageUrls?.join(",") || ""} onChange={e => setPet(prev => ({ ...prev, imageUrls: e.target.value.split(",") }))} placeholder="Ek Fotoğraf URL'leri (virgülle ayır)" className="input" />
        <input name="videoUrls" value={pet.videoUrls?.join(",") || ""} onChange={e => setPet(prev => ({ ...prev, videoUrls: e.target.value.split(",") }))} placeholder="Video URL'leri (virgülle ayır)" className="input" />
        <div className="border rounded p-3">
          <div className="font-semibold mb-2">Sağlık Kayıtları</div>
          <div className="flex gap-2 mb-2">
            <input value={healthDate} onChange={e => setHealthDate(e.target.value)} type="date" className="input" placeholder="Tarih" />
            <input value={healthType} onChange={e => setHealthType(e.target.value)} placeholder="Tip (ör: muayene)" className="input" />
            <input value={healthNote} onChange={e => setHealthNote(e.target.value)} placeholder="Not" className="input" />
            <button type="button" onClick={addHealthRecord} className="btn-primary">Ekle</button>
          </div>
          <ul className="list-disc pl-5">
            {(pet.healthRecords || []).map((rec, i) => <li key={i}>{rec.date} - {rec.type} - {rec.note}</li>)}
          </ul>
        </div>
        <div className="border rounded p-3">
          <div className="font-semibold mb-2">Aşı Kayıtları</div>
          <div className="flex gap-2 mb-2">
            <input value={vaccineDate} onChange={e => setVaccineDate(e.target.value)} type="date" className="input" placeholder="Tarih" />
            <input value={vaccineName} onChange={e => setVaccineName(e.target.value)} placeholder="Aşı Adı" className="input" />
            <input value={vaccineNote} onChange={e => setVaccineNote(e.target.value)} placeholder="Not" className="input" />
            <button type="button" onClick={addVaccineRecord} className="btn-primary">Ekle</button>
          </div>
          <ul className="list-disc pl-5">
            {(pet.vaccinationRecords || []).map((rec, i) => <li key={i}>{rec.date} - {rec.vaccine} - {rec.note}</li>)}
          </ul>
        </div>
        <div className="border rounded p-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="memorial" checked={!!pet.memorial} onChange={handleChange} />
            Anı Sayfası (vefat eden hayvan için)
          </label>
          {pet.memorial && (
            <textarea name="memorialNote" value={pet.memorialNote} onChange={handleChange} placeholder="Anı Notu" className="input" />
          )}
        </div>
        <button type="submit" className="btn-primary w-full">Kaydet</button>
      </form>
    </div>
  );
};

export default PetEditPage;