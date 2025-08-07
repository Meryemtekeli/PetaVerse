import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export interface CalendarEvent {
  id?: string;
  userId: string;
  petId: string;
  petName: string;
  title: string;
  description: string;
  eventType: 'vaccine' | 'medicine' | 'vet' | 'breeding' | 'birth' | 'other';
  date: string;
  time?: string;
  isCompleted: boolean;
  reminder: boolean;
  reminderTime?: string;
  createdAt: string;
}

export const createCalendarEvent = async (event: CalendarEvent) => {
  const docRef = await addDoc(collection(db, "calendarEvents"), event);
  return docRef.id;
};

export const updateCalendarEvent = async (id: string, event: Partial<CalendarEvent>) => {
  await updateDoc(doc(db, "calendarEvents", id), event);
};

export const deleteCalendarEvent = async (id: string) => {
  await deleteDoc(doc(db, "calendarEvents", id));
};

export const getCalendarEvent = async (id: string) => {
  const docSnap = await getDoc(doc(db, "calendarEvents", id));
  return { id: docSnap.id, ...docSnap.data() } as CalendarEvent;
};

export const getCalendarEvents = async (userId: string, startDate?: string, endDate?: string) => {
  let q = query(collection(db, "calendarEvents"), where('userId', '==', userId));
  if (startDate && endDate) {
    q = query(q, where('date', '>=', startDate), where('date', '<=', endDate));
  }
  q = query(q, orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as CalendarEvent[];
};

export const getUpcomingEvents = async (userId: string, days: number = 7) => {
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  const futureDateStr = futureDate.toISOString().split('T')[0];
  
  const q = query(
    collection(db, "calendarEvents"),
    where('userId', '==', userId),
    where('date', '>=', today),
    where('date', '<=', futureDateStr),
    where('isCompleted', '==', false),
    orderBy('date', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as CalendarEvent[];
};

export const markEventCompleted = async (id: string) => {
  await updateDoc(doc(db, "calendarEvents", id), { isCompleted: true });
}; 