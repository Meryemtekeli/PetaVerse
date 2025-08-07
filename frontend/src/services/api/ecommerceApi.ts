import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

export interface Product {
  id?: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  condition: 'new' | 'used' | 'refurbished';
  stock: number;
  location: string;
  shipping: boolean;
  shippingCost?: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
}

export interface Order {
  id?: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  productId: string;
  productTitle: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
}

export const createProduct = async (product: Product) => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  await updateDoc(doc(db, "products", id), product);
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};

export const getProduct = async (id: string) => {
  const docSnap = await getDoc(doc(db, "products", id));
  return { id: docSnap.id, ...docSnap.data() } as Product;
};

export const getProducts = async (category?: string) => {
  let q = collection(db, "products");
  if (category) {
    q = query(q, where('category', '==', category));
  }
  q = query(q, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
};

export const searchProducts = async (query: string) => {
  const allProducts = await getProducts();
  return allProducts.filter(product => 
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );
};

export const createOrder = async (order: Order) => {
  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
};

export const updateOrder = async (id: string, order: Partial<Order>) => {
  await updateDoc(doc(db, "orders", id), order);
};

export const getOrders = async (userId: string, role: 'buyer' | 'seller') => {
  const field = role === 'buyer' ? 'buyerId' : 'sellerId';
  const q = query(collection(db, "orders"), where(field, '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Order[];
}; 