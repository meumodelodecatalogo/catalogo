import { 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const login = async (email: string, password: string) => {
  if (!auth) throw new Error("Firebase Auth não inicializado.");
  try {
    return await firebaseSignIn(auth, email, password);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Credenciais inválidas ou erro de conexão.");
  }
};

export const logout = async () => {
  if (!auth) return Promise.resolve();
  try {
    return await firebaseSignOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw new Error("Erro ao sair da conta.");
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) return () => {};
  return firebaseOnAuthStateChanged(auth, callback);
};

export type { User };
