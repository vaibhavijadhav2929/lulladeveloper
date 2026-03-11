import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCwSfu8qRfhM5jDpMSOh4I1LodCPS9r6j0",
    authDomain: "tb-lulla.firebaseapp.com",
    databaseURL: "https://tb-lulla-default-rtdb.firebaseio.com",
    projectId: "tb-lulla",
    storageBucket: "tb-lulla.firebasestorage.app",
    messagingSenderId: "689664764980",
    appId: "1:689664764980:web:3b0614c53674ac2230ee61",
    measurementId: "G-K437RWVPYC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);  // Realtime Database
