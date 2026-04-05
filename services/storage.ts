import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads a file to Firebase Storage and returns the public download URL.
 * @param file The file to upload
 * @param path The path in storage (e.g., 'products/imageUrl.jpg')
 * @returns Promise<string> The download URL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not initialized");
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to storage:", error);
    throw error;
  }
}
