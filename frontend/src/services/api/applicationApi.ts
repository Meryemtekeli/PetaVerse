import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export interface Application {
  id?: string;
  listingId: string;
  applicantId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}

export const createApplication = async (application: Application) => {
  const docRef = await addDoc(collection(db, "applications"), application);
  return docRef.id;
};

export const updateApplication = async (id: string, application: Partial<Application>) => {
  await updateDoc(doc(db, "applications", id), application);
};

export const getApplicationsByListing = async (listingId: string) => {
  const q = query(collection(db, "applications"), where("listingId", "==", listingId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Application[];
};

export const getApplicationsByUser = async (userId: string) => {
  const q = query(collection(db, "applications"), where("applicantId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Application[];
}; 