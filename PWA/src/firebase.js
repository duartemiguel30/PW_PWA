// Importa o necessário do Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyClPbJkEPq82ZVMM89tJ3jWRciyIn_CseI",
  authDomain: "pwa-pw-640bf.firebaseapp.com",
  projectId: "pwa-pw-640bf",
  storageBucket: "pwa-pw-640bf.firebasestorage.app",
  messagingSenderId: "895788955747",
  appId: "1:895788955747:web:2c4277493e817b416d6056",
  measurementId: "G-M1BRBXJWGW"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa o módulo de autenticação e o provider do Google
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exporta os itens que serão utilizados em outros arquivos
export { auth, provider, signInWithPopup };
