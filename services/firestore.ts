import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/data";

const COLLECTION_NAME = "products";

export async function getProducts(onlyActive = true) {
  if (!db) return [];
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    const q = onlyActive 
      ? query(productsRef, where("active", "==", true))
      : query(productsRef, orderBy("category"));
      
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
}

export async function createProduct(product: Partial<Product>) {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    const productsRef = collection(db, COLLECTION_NAME);
    return await addDoc(productsRef, {
      ...product,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao criar produto no Firestore:", error);
    throw new Error("Não foi possível salvar o produto. Verifique sua conexão.");
  }
}

export async function updateProduct(productId: string, data: Partial<Product>) {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    return await updateDoc(productRef, data);
  } catch (error) {
    console.error("Erro ao atualizar produto no Firestore:", error);
    throw new Error("Não foi possível atualizar o produto.");
  }
}

export async function deleteProduct(productId: string) {
  if (!db) throw new Error("Banco de dados não inicializado.");
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    return await deleteDoc(productRef);
  } catch (error) {
    console.error("Erro ao deletar produto no Firestore:", error);
    throw new Error("Não foi possível excluir o produto.");
  }
}
