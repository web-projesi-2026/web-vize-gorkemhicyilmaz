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

    if (dropdown) {
        dropdown.classList.toggle('show');
    }
};

window.openAuthModal = (tabType = 'login') => {
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

    if (modal) {
        modal.classList.remove('show');
    }
};

window.switchAuthTab = (type) => {
    const isLogin = type === 'login';

    document.getElementById('tab-login')?.classList.toggle('active', isLogin);
    document.getElementById('tab-register')?.classList.toggle('active', !isLogin);
    document.getElementById('loginForm')?.classList.toggle('active', isLogin);
    document.getElementById('registerForm')?.classList.toggle('active', !isLogin);
};

window.switchPageAuthTab = (type) => {
    const isLogin = type === 'login';

    document.getElementById('page-tab-login')?.classList.toggle('active', isLogin);
    document.getElementById('page-tab-register')?.classList.toggle('active', !isLogin);
    document.getElementById('pageLoginForm')?.classList.toggle('active', isLogin);
    document.getElementById('pageRegisterForm')?.classList.toggle('active', !isLogin);
};

window.openCreateModal = () => {
    document.getElementById('createModal')?.classList.add('show');
};

window.closeCreateModal = () => {
    document.getElementById('createModal')?.classList.remove('show');
};

/* HERO SLIDER */
let heroSlideIndex = 0;
let heroSlideTimer = null;

window.setHeroSlide = (index) => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (!slides.length) return;

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    heroSlideIndex = index;
};

function startHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');

    if (slides.length <= 1) return;

    if (heroSlideTimer) clearInterval(heroSlideTimer);

    heroSlideTimer = setInterval(() => {
        setHeroSlide(heroSlideIndex + 1);
    }, 3500);
}

/* SOSYAL POST TYPE SWITCH */
function initPostTypeSwitch() {
    const input = document.getElementById('postTypeInput');
    const buttons = document.querySelectorAll('.post-type-btn');

    if (!input || !buttons.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;

            input.value = type;

            buttons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/* TOAST AUTO CLOSE */
function initToastAutoClose() {
    const toast = document.querySelector('.site-toast');

    if (!toast) return;

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

/* GLOBAL CLICK HANDLER */
window.addEventListener('click', (e) => {
    const dropdown = document.getElementById('accountDropdown');
    const accountBtn = document.querySelector('.account-btn');
    const authModal = document.getElementById('authModal');
    const createModal = document.getElementById('createModal');

    if (dropdown && accountBtn && !accountBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
    }

    if (e.target === authModal) {
        window.closeAuthModal();
    }

    if (e.target === createModal) {
        window.closeCreateModal();
    }
});

/* PAGE INIT */
window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.setHeroSlide === 'function') {
        window.setHeroSlide(0);
    }

    startHeroSlider();
    initPostTypeSwitch();
    initToastAutoClose();
});