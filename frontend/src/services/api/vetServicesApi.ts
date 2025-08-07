import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export interface VetService {
  id?: string;
  name: string;
  type: 'vet' | 'petshop' | 'groomer' | 'trainer';
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  services: string[];
  workingHours: {
    [key: string]: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

export const createVetService = async (service: VetService) => {
  const docRef = await addDoc(collection(db, "vetServices"), service);
  return docRef.id;
};

export const updateVetService = async (id: string, service: Partial<VetService>) => {
  await updateDoc(doc(db, "vetServices", id), service);
};

export const deleteVetService = async (id: string) => {
  await deleteDoc(doc(db, "vetServices", id));
};

export const getVetService = async (id: string) => {
  const docSnap = await getDoc(doc(db, "vetServices", id));
  return { id: docSnap.id, ...docSnap.data() } as VetService;
};

export const getVetServices = async (type?: 'vet' | 'petshop' | 'groomer' | 'trainer') => {
  let q = collection(db, "vetServices");
  if (type) {
    q = query(q, where('type', '==', type));
  }
  q = query(q, orderBy('rating', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as VetService[];
};

export const searchVetServices = async (query: string) => {
  const allServices = await getVetServices();
  return allServices.filter(service => 
    service.name.toLowerCase().includes(query.toLowerCase()) ||
    service.description.toLowerCase().includes(query.toLowerCase()) ||
    service.address.toLowerCase().includes(query.toLowerCase())
  );
}; 