import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export interface ForumPost {
  id?: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  likes: string[];
  comments: ForumComment[];
  createdAt: string;
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface PetStory {
  id?: string;
  authorId: string;
  authorName: string;
  petId: string;
  petName: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: string[];
  comments: ForumComment[];
  createdAt: string;
}

export interface UserFollow {
  id?: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

// Forum API
export const createForumPost = async (post: ForumPost) => {
  const docRef = await addDoc(collection(db, "forumPosts"), post);
  return docRef.id;
};

export const getForumPosts = async (category?: string) => {
  let q = collection(db, "forumPosts");
  if (category) {
    q = query(q, where('category', '==', category));
  }
  q = query(q, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as ForumPost[];
};

// PetStory API
export const createPetStory = async (story: PetStory) => {
  const docRef = await addDoc(collection(db, "petStories"), story);
  return docRef.id;
};

export const getPetStories = async () => {
  const q = query(collection(db, "petStories"), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as PetStory[];
};

// Follow API
export const followUser = async (followerId: string, followingId: string) => {
  const follow: UserFollow = {
    followerId,
    followingId,
    createdAt: new Date().toISOString(),
  };
  await addDoc(collection(db, "userFollows"), follow);
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const q = query(
    collection(db, "userFollows"),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    await deleteDoc(doc(db, "userFollows", snap.docs[0].id));
  }
};

export const getFollowers = async (userId: string) => {
  const q = query(collection(db, "userFollows"), where('followingId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as UserFollow[];
};

export const getFollowing = async (userId: string) => {
  const q = query(collection(db, "userFollows"), where('followerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as UserFollow[];
}; 