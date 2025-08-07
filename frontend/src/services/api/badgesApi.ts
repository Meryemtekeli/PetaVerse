import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export interface Badge {
  id?: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  points: number;
  createdAt: string;
}

export interface UserBadge {
  id?: string;
  userId: string;
  badgeId: string;
  badgeName: string;
  earnedAt: string;
}

export interface UserPoints {
  id?: string;
  userId: string;
  points: number;
  level: number;
  totalActions: number;
  lastUpdated: string;
}

export const createBadge = async (badge: Badge) => {
  const docRef = await addDoc(collection(db, "badges"), badge);
  return docRef.id;
};

export const getBadges = async () => {
  const q = query(collection(db, "badges"), orderBy('points', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Badge[];
};

export const getUserBadges = async (userId: string) => {
  const q = query(collection(db, "userBadges"), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as UserBadge[];
};

export const awardBadge = async (userId: string, badgeId: string, badgeName: string) => {
  const userBadge: UserBadge = {
    userId,
    badgeId,
    badgeName,
    earnedAt: new Date().toISOString(),
  };
  await addDoc(collection(db, "userBadges"), userBadge);
};

export const getUserPoints = async (userId: string) => {
  const q = query(collection(db, "userPoints"), where('userId', '==', userId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as UserPoints;
  }
  return null;
};

export const updateUserPoints = async (userId: string, points: number) => {
  const existingPoints = await getUserPoints(userId);
  const newPoints = (existingPoints?.points || 0) + points;
  const level = Math.floor(newPoints / 100) + 1;
  
  if (existingPoints) {
    await updateDoc(doc(db, "userPoints", existingPoints.id!), {
      points: newPoints,
      level,
      totalActions: existingPoints.totalActions + 1,
      lastUpdated: new Date().toISOString(),
    });
  } else {
    await addDoc(collection(db, "userPoints"), {
      userId,
      points: newPoints,
      level,
      totalActions: 1,
      lastUpdated: new Date().toISOString(),
    });
  }
};

export const getLeaderboard = async () => {
  const q = query(collection(db, "userPoints"), orderBy('points', 'desc'), orderBy('lastUpdated', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as UserPoints[];
}; 