import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export interface PetProfile {
  id?: string;
  ownerId: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  age: number;
  weight: number;
  gender: string;
  size: string;
  description: string;
  mainImageUrl: string;
  imageUrls: string[];
  videoUrls: string[];
  healthRecords: Array<{ date: string; type: string; note: string }>;
  vaccinationRecords: Array<{ date: string; vaccine: string; note: string }>;
  memorial?: boolean;
  memorialNote?: string;
  createdAt: string;
}

export const createPet = async (pet: PetProfile) => {
  const docRef = await addDoc(collection(db, "pets"), pet);
  return docRef.id;
};

export const updatePet = async (id: string, pet: Partial<PetProfile>) => {
  await updateDoc(doc(db, "pets", id), pet);
};

export const deletePet = async (id: string) => {
  await deleteDoc(doc(db, "pets", id));
};

export const getPet = async (id: string) => {
  const petDoc = await getDoc(doc(db, "pets", id));
  return { id: petDoc.id, ...petDoc.data() } as PetProfile;
};

export const getPetsByOwner = async (ownerId: string) => {
  const petsSnap = await getDocs(collection(db, "pets"));
  return petsSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter((p: any) => p.ownerId === ownerId) as PetProfile[];
};