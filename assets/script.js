/* ==========================================================================
   FIREBASE MODÜLLERİ VE KONFİGÜRASYON
   ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, 
    onAuthStateChanged, signOut, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCx-Mm5qyxd5pRxPTKYBgGL5I-GF8FgW6U",
  authDomain: "promptla.firebaseapp.com",
  projectId: "promptla",
  storageBucket: "promptla.firebasestorage.app",
  messagingSenderId: "704882212037",
  appId: "1:704882212037:web:7b264f0e1342769d2e84ac",
  measurementId: "G-77GZFLKYL8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

/* ==========================================================================
   BEKÇİ (OTURUM TAKİBİ)
   ========================================================================== */
onAuthStateChanged(auth, (user) => {
    const dropdown = document.getElementById('accountDropdown');
    const accountBtn = document.querySelector('.account-btn');
    if (!accountBtn || !dropdown) return;

    if (user) {
        accountBtn.innerHTML = `
            <img src="${user.photoURL || '../images/default-avatar.png'}" 
                 style="width:24px; height:24px; border-radius:50%; border:1px solid var(--accent); object-fit: cover;">
            ${user.displayName ? user.displayName.split(' ')[0] : 'Kullanıcı'} 
        `;
        dropdown.innerHTML = `
            <a href="#">Profillerim</a>
            <a href="javascript:void(0)" onclick="logout()">Çıkış Yap</a>
        `;
    } else {
        accountBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Hesap
        `;
        dropdown.innerHTML = `
            <a href="javascript:void(0)" onclick="openAuthModal('login')">Giriş Yap</a>
            <a href="javascript:void(0)" onclick="openAuthModal('register')">Kayıt Ol</a>
        `;
    }
});

/* ==========================================================================
   WINDOW FONKSİYONLARI (KESİN ERİŞİM İÇİN)
   ========================================================================== */

window.logout = () => {
    signOut(auth).then(() => {
        alert("Çıkış yapıldı.");
        window.location.reload();
    }).catch((e) => alert("Hata: " + e.message));
};

window.socialLogin = async (providerName) => {
    const provider = providerName === 'google' ? googleProvider : githubProvider;
    try {
        const result = await signInWithPopup(auth, provider);
        alert(`Hoş geldin ${result.user.displayName}!`);
        window.closeAuthModal();
    } catch (e) {
        alert("Giriş başarısız: " + e.message);
    }
};

window.toggleMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('nav');
    if (hamburger && nav) {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
    }
};

window.toggleDropdown = (event) => {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('accountDropdown');
    if (dropdown) dropdown.classList.toggle('show');
};

window.openAuthModal = (tabType) => {
    const modal = document.getElementById('authModal');
    const dropdown = document.getElementById('accountDropdown');
    if (dropdown) dropdown.classList.remove('show');
    if (modal) {
        modal.classList.add('show');
        window.switchAuthTab(tabType);
    }
};

window.closeAuthModal = () => {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('show');
};

window.switchAuthTab = (type) => {
    const isLogin = type === 'login';
    document.getElementById('tab-login')?.classList.toggle('active', isLogin);
    document.getElementById('tab-register')?.classList.toggle('active', !isLogin);
    document.getElementById('loginForm')?.classList.toggle('active', isLogin);
    document.getElementById('registerForm')?.classList.toggle('active', !isLogin);
};

window.resimDegistir = () => {
    const resim1 = document.getElementById('anaResim');
    const resim2 = document.getElementById('ikinciResim');
    if (resim1 && resim2) {
        const isFirstActive = resim1.classList.contains('active');
        resim1.classList.toggle('active', !isFirstActive);
        resim2.classList.toggle('active', isFirstActive);
    }
};

// SOSYAL SAYFASI İÇİN MODALLAR
window.openCreateModal = () => {
    document.getElementById('createModal')?.classList.add('show');
};
window.closeCreateModal = () => {
    document.getElementById('createModal')?.classList.remove('show');
};

/* ==========================================================================
   TIKLAMA OLAYLARI (GLOBAL)
   ========================================================================== */
window.addEventListener('click', (e) => {
    const dropdown = document.getElementById('accountDropdown');
    const accountBtn = document.querySelector('.account-btn');
    const authModal = document.getElementById('authModal');
    const createModal = document.getElementById('createModal');

    // Dropdown kapatma
    if (dropdown && !accountBtn?.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }
    // Modal dışına tıklayınca kapatma
    if (e.target === authModal) window.closeAuthModal();
    if (e.target === createModal) window.closeCreateModal();
});

function switchPageAuthTab(type) {
    // Tüm butonlardan active sınıfını kaldır
    document.getElementById('page-tab-login').classList.remove('active');
    document.getElementById('page-tab-register').classList.remove('active');
    
    // Tüm formları gizle
    document.getElementById('pageLoginForm').classList.remove('active');
    document.getElementById('pageRegisterForm').classList.remove('active');
    
    if(type === 'login') {
        document.getElementById('page-tab-login').classList.add('active');
        document.getElementById('pageLoginForm').classList.add('active');
    } else {
        document.getElementById('page-tab-register').classList.add('active');
        document.getElementById('pageRegisterForm').classList.add('active');
    }
}
