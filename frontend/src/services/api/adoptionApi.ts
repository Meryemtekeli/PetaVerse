import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export interface AdoptionListing {
  id?: string;
  ownerId: string;
  petId: string;
  type: 'adoption' | 'breeding';
  title: string;
  description: string;
  status: 'active' | 'pending' | 'closed';
  applicants: string[];
  createdAt: string;
  aiSuggested?: boolean;
  contractUrl?: string;
}

export const createAdoptionListing = async (listing: AdoptionListing) => {
  const docRef = await addDoc(collection(db, "adoptionListings"), listing);
  return docRef.id;
};

export const updateAdoptionListing = async (id: string, listing: Partial<AdoptionListing>) => {
  await updateDoc(doc(db, "adoptionListings", id), listing);
};

export const deleteAdoptionListing = async (id: string) => {
  await deleteDoc(doc(db, "adoptionListings", id));
};

export const getAdoptionListing = async (id: string) => {
  const docSnap = await getDoc(doc(db, "adoptionListings", id));
  return { id: docSnap.id, ...docSnap.data() } as AdoptionListing;
};

export const getAdoptionListings = async (type?: 'adoption' | 'breeding') => {
  let q = collection(db, "adoptionListings");
  if (type) {
    q = query(q, where('type', '==', type));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as AdoptionListing[];
};