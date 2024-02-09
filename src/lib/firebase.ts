import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: "smallnote-c787e.firebaseapp.com",
  projectId: "smallnote-c787e",
  storageBucket: "smallnote-c787e.appspot.com",
  messagingSenderId: "525941649362",
  appId: "1:525941649362:web:bd3e056a83de3abe8fe20b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToFirebase(image_url: string, name: string) {
  try {
    const response = await fetch(image_url, {
      method: "GET",
    });
    const buffer = await response.arrayBuffer();
    const filename = `${name.replace(" ", "")}${Date.now()}.jpeg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg",
    });
    const firebaseUrl = await getDownloadURL(storageRef);
    return firebaseUrl;
  } catch (err) {
    console.error("Error upload file to firebase: ", String(err));
  }
}
