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
   BEKÇİ (OTURUM TAKİBİ - YENİ DÜZENLEME)
   ========================================================================== */
onAuthStateChanged(auth, (user) => {
    const dropdown = document.getElementById('accountDropdown');
    const accountBtn = document.querySelector('.account-btn');
    if (!accountBtn || !dropdown) return;

    // 1. PHP ile klasik giriş yapılmış mı kontrol et (Notu oku)
    const phpUser = localStorage.getItem('phpUser');

    if (phpUser) {
        // PHP girişi varsa menüyü PHP kullanıcısına göre ayarla (Baş harfini ikon yapar)
        accountBtn.innerHTML = `
            <div style="width:24px; height:24px; border-radius:50%; background:var(--accent); color:#000; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">
                ${phpUser.charAt(0).toUpperCase()}
            </div>
            ${phpUser.split(' ')[0]} 
        `;
        dropdown.innerHTML = `
            <a href="#">Profillerim</a>
            <a href="javascript:void(0)" onclick="window.klasikCikis()">Çıkış Yap</a>
        `;
    } 
    // 2. PHP girişi yoksa, Google/GitHub (Firebase) girişi var mı kontrol et
    else if (user) {
        accountBtn.innerHTML = `
            <img src="${user.photoURL || 'images/default-avatar.png'}" 
                 style="width:24px; height:24px; border-radius:50%; border:1px solid var(--accent); object-fit: cover;">
            ${user.displayName ? user.displayName.split(' ')[0] : 'Kullanıcı'} 
        `;
        dropdown.innerHTML = `
            <a href="#">Profillerim</a>
            <a href="javascript:void(0)" onclick="window.logout()">Çıkış Yap</a>
        `;
    } 
    // 3. Hiçbiri yoksa (Giriş Yapılmamışsa)
    else {
        accountBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Hesap
        `;
        dropdown.innerHTML = `
            <a href="javascript:void(0)" onclick="window.openAuthModal('login')">Giriş Yap</a>
            <a href="javascript:void(0)" onclick="window.openAuthModal('register')">Kayıt Ol</a>
        `;
    }
});

/* ==========================================================================
   WINDOW FONKSİYONLARI (KESİN ERİŞİM İÇİN)
   ========================================================================== */

// Firebase çıkışı
window.logout = () => {
    signOut(auth).then(() => {
        alert("Çıkış yapıldı.");
        window.location.reload();
    }).catch((e) => alert("Hata: " + e.message));
};

// PHP (Klasik) çıkışı eklendi
window.klasikCikis = () => {
    localStorage.removeItem('phpUser'); // Tarayıcıdaki notu sil
    alert("Çıkış yapıldı.");
    window.location.reload();
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
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (!loginForm || !registerForm) return;

    if (type === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
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

window.switchPageAuthTab = (type) => {
    const tabLogin = document.getElementById('page-tab-login');
    const tabRegister = document.getElementById('page-tab-register');
    const loginForm = document.getElementById('pageLoginForm');
    const registerForm = document.getElementById('pageRegisterForm');

    if (!loginForm || !registerForm) return;

    if(type === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
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
