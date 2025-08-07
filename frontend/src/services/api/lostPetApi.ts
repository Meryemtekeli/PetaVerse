import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export interface LostPet {
  id?: string;
  ownerId: string;
  petName: string;
  petType: string;
  breed: string;
  color: string;
  age: number;
  gender: string;
  description: string;
  imageUrl: string;
  lostDate: string;
  lostLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  status: 'lost' | 'found' | 'reunited';
  foundDate?: string;
  foundLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
}

export const createLostPetReport = async (lostPet: LostPet) => {
  const docRef = await addDoc(collection(db, "lostPets"), lostPet);
  return docRef.id;
};

export const updateLostPetReport = async (id: string, lostPet: Partial<LostPet>) => {
  await updateDoc(doc(db, "lostPets", id), lostPet);
};

export const deleteLostPetReport = async (id: string) => {
  await deleteDoc(doc(db, "lostPets", id));
};

export const getLostPetReport = async (id: string) => {
  const docSnap = await getDoc(doc(db, "lostPets", id));
  return { id: docSnap.id, ...docSnap.data() } as LostPet;
};

export const getLostPetReports = async (status?: 'lost' | 'found' | 'reunited') => {
  let q = collection(db, "lostPets");
  if (status) {
    q = query(q, where('status', '==', status));
  }
  q = query(q, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as LostPet[];
};

export const getLostPetsByLocation = async (latitude: number, longitude: number, radius: number = 10) => {
  // Basit mesafe hesaplama (gerçek uygulamada daha gelişmiş algoritma kullanılabilir)
  const allPets = await getLostPetReports('lost');
  return allPets.filter(pet => {
    const distance = Math.sqrt(
      Math.pow(pet.lostLocation.latitude - latitude, 2) + 
      Math.pow(pet.lostLocation.longitude - longitude, 2)
    );
    return distance <= radius / 111; // Yaklaşık km cinsinden
  });
}; 