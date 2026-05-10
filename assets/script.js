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

window.openCreateModal = () => {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.add('show');
        const content = modal.querySelector('.modal-content');
        if (content) content.scrollTop = 0;
    }
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

/* PROMPT KOPYALAMA */
function fallbackCopyText(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.left = '-9999px';
    area.style.top = '-9999px';
    document.body.appendChild(area);
    area.focus();
    area.select();

    try {
        const ok = document.execCommand('copy');
        document.body.removeChild(area);
        return ok ? Promise.resolve() : Promise.reject(new Error('copy failed'));
    } catch (err) {
        document.body.removeChild(area);
        return Promise.reject(err);
    }
}

window.copyPrompt = function(button) {
    const promptBox = button.closest('.prompt-code-box');
    const promptText = promptBox ? promptBox.querySelector('.prompt-scroll-text') : null;

    if (!promptText) return;

    const text = promptText.innerText.trim();
    const oldText = button.innerText;
    const copyJob = (navigator.clipboard && window.isSecureContext)
        ? navigator.clipboard.writeText(text)
        : fallbackCopyText(text);

    button.classList.remove('copied', 'error');
    button.disabled = true;

    copyJob.then(() => {
        button.innerText = 'Kopyalandı ✓';
        button.classList.add('copied');

        setTimeout(() => {
            button.innerText = oldText;
            button.classList.remove('copied');
            button.disabled = false;
        }, 1500);
    }).catch(() => {
        button.innerText = 'Kopyalanamadı';
        button.classList.add('error');

        setTimeout(() => {
            button.innerText = oldText;
            button.classList.remove('error');
            button.disabled = false;
        }, 1500);
    });
};

window.togglePromptText = function(button) {
    const promptBox = button.closest('.prompt-code-box');
    if (!promptBox) return;

    const isExpanded = promptBox.classList.toggle('expanded');
    promptBox.classList.toggle('collapsed', !isExpanded);
    button.innerText = isExpanded ? 'Daha az göster' : 'Daha fazla …';
};

function initPromptExpandButtons() {
    document.querySelectorAll('.prompt-code-box').forEach((box) => {
        const text = box.querySelector('.prompt-text-collapsible');
        const button = box.querySelector('.prompt-expand-btn');

        if (!text || !button) return;

        const maxHeight = window.innerWidth <= 480 ? 220 : 260;
        if (text.scrollHeight <= maxHeight + 8) {
            button.classList.add('is-hidden');
            box.classList.remove('collapsed');
            box.classList.add('expanded');
        }
    });
}

window.switchPageAuthTab = (type) => {
    const isLogin = type === 'login';

    document.getElementById('page-tab-login')?.classList.toggle('active', isLogin);
    document.getElementById('page-tab-register')?.classList.toggle('active', !isLogin);
    document.getElementById('pageLoginForm')?.classList.toggle('active', isLogin);
    document.getElementById('pageRegisterForm')?.classList.toggle('active', !isLogin);
};

window.closeTestNotice = () => {
    const notice = document.getElementById('testNotice');
    if (notice) notice.style.display = 'none';
};

window.socialLogin = (provider) => {
    const label = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'Sosyal';
    alert(label + ' ile giriş özelliği yakında aktif edilecek.');
};

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



/* SOSYAL GÖRSEL ÖNİZLEME */
window.clearSocialImage = function() {
    const input = document.getElementById('postImageInput');
    const preview = document.getElementById('postImagePreview');
    const wrap = document.getElementById('postImagePreviewWrap');
    const fileName = document.getElementById('postImageFileName');

    if (input) input.value = '';
    if (preview) preview.src = '';
    if (wrap) wrap.classList.remove('show');
    if (fileName) fileName.textContent = 'JPG, PNG veya WEBP. Maksimum 5 MB.';
};

function initSocialImageUpload() {
    const input = document.getElementById('postImageInput');
    const preview = document.getElementById('postImagePreview');
    const wrap = document.getElementById('postImagePreviewWrap');
    const fileName = document.getElementById('postImageFileName');

    if (!input || !preview || !wrap) return;

    input.addEventListener('change', () => {
        const file = input.files && input.files[0] ? input.files[0] : null;

        if (!file) {
            window.clearSocialImage();
            return;
        }

        if (fileName) {
            fileName.textContent = file.name;
        }

        if (file.type && !file.type.startsWith('image/')) {
            window.clearSocialImage();
            alert('Lütfen JPG, PNG veya WEBP formatında bir fotoğraf seç.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            preview.src = event.target.result;
            wrap.classList.add('show');
        };
        reader.readAsDataURL(file);
    });
}

/* PAGE INIT */
window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.setHeroSlide === 'function') {
        window.setHeroSlide(0);
    }

    startHeroSlider();
    initPostTypeSwitch();
    initPromptExpandButtons();
    initToastAutoClose();
    initSocialImageUpload();
});

/* ================================
   GITHUB HTML DEMO DAVRANISLARI
================================ */
(function() {
    function showDemoToast(message, type = 'success') {
        document.querySelectorAll('.site-toast.demo-generated').forEach((el) => el.remove());
        const toast = document.createElement('div');
        toast.className = 'site-toast demo-generated ' + (type === 'error' ? 'error' : 'success');
        toast.innerHTML = '<span>' + message + '</span><button type="button" aria-label="Kapat">×</button>';
        toast.querySelector('button').addEventListener('click', () => toast.remove());
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3400);
    }

    window.showDemoToast = showDemoToast;

    function toggleDemoButton(button) {
        button.classList.toggle('active');
        const span = button.querySelector('span');
        if (span) {
            const current = parseInt(span.textContent || '0', 10) || 0;
            span.textContent = button.classList.contains('active') ? current + 1 : Math.max(0, current - 1);
        }
        const txt = button.dataset.activeText && button.dataset.passiveText;
        if (txt) {
            const spanHtml = span ? ' <span>' + span.textContent + '</span>' : '';
            button.innerHTML = (button.classList.contains('active') ? button.dataset.activeText : button.dataset.passiveText) + spanHtml;
        }
    }

    function createPostCard(content, imageSrc, type) {
        const card = document.createElement('div');
        card.className = 'post-card demo-created-post';
        const safeText = (content || '').trim() || 'Fotoğraflı demo gönderi';
        const now = new Date();
        const stamp = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
        card.innerHTML = `
            <div class="post-avatar"><span>GH</span></div>
            <div class="post-content">
                <div class="post-author">Görkem Hiçyılmaz <span>• ${stamp}</span></div>
                <div class="post-badge">${type === 'prompt' ? 'Prompt Paylaşımı' : 'Topluluk Gönderisi'}</div>
                <p class="post-text"></p>
                ${imageSrc ? `<a href="${imageSrc}" target="_blank" rel="noopener" class="post-image-link"><img src="${imageSrc}" alt="Demo gönderi fotoğrafı" class="post-image"></a>` : ''}
                <div class="post-actions social-post-actions">
                    <button type="button" class="mini-action-btn" data-demo-toggle data-active-text="❤️ Beğenildi" data-passive-text="🤍 Beğen">🤍 Beğen <span>0</span></button>
                    <button type="button" class="mini-action-btn" data-demo-toggle data-active-text="⭐ Kaydedildi" data-passive-text="☆ Kaydet">☆ Kaydet <span>0</span></button>
                    <span>💬 Yorum yakında</span>
                </div>
            </div>`;
        card.querySelector('.post-text').textContent = safeText;
        return card;
    }

    window.addEventListener('click', (event) => {
        const toggleBtn = event.target.closest('[data-demo-toggle]');
        if (toggleBtn) {
            event.preventDefault();
            toggleDemoButton(toggleBtn);
        }
    });

    window.addEventListener('submit', (event) => {
        const form = event.target;
        if (!form.matches('[data-demo-form], [data-demo-social-form], [data-demo-profile-form], [data-demo-password-form]')) return;
        event.preventDefault();

        if (form.matches('[data-demo-social-form]')) {
            const textarea = form.querySelector('textarea');
            const content = textarea ? textarea.value : '';
            const preview = document.getElementById('postImagePreview');
            const imageSrc = preview && preview.src ? preview.src : '';
            if (!content.trim() && !imageSrc) {
                showDemoToast('Paylaşmak için metin yaz veya fotoğraf seç.', 'error');
                return;
            }
            const typeInput = document.getElementById('postTypeInput');
            const feed = document.querySelector('.social-feed');
            const header = document.querySelector('.feed-header');
            if (feed && header) {
                feed.insertBefore(createPostCard(content, imageSrc, typeInput ? typeInput.value : 'genel'), header.nextSibling);
            }
            form.reset();
            if (window.clearSocialImage) window.clearSocialImage();
            if (window.closeCreateModal) window.closeCreateModal();
            showDemoToast('Demo gönderin sayfaya eklendi. GitHub sürümünde veri tarayıcı içinde kalır.');
            return;
        }

        if (form.matches('[data-demo-password-form]')) {
            const current = form.querySelector('[name="currentPassword"]');
            const next = form.querySelector('[name="newPassword"]');
            if (!current || current.value !== '123456') {
                showDemoToast('Demo için mevcut şifre: 123456. Yanlış şifreyle yeni şifre kabul edilmez.', 'error');
                return;
            }
            if (!next || next.value.length < 6) {
                showDemoToast('Yeni şifre en az 6 karakter olmalı.', 'error');
                return;
            }
            form.reset();
            showDemoToast('Demo şifre kontrolü başarılı. Gerçek işlem canlı sürümde yapılır.');
            return;
        }

        if (form.matches('[data-demo-profile-form]')) {
            showDemoToast('Profil bilgileri demo olarak kaydedildi. GitHub sürümünde sunucuya gönderilmez.');
            return;
        }

        if (form.matches('[data-demo-form]')) {
            if (form.id === 'loginForm' || form.id === 'registerForm' || form.id === 'pageLoginForm' || form.id === 'pageRegisterForm') {
                if (window.closeAuthModal) window.closeAuthModal();
                showDemoToast('Demo giriş başarılı. Statik sürümde gerçek üyelik sistemi çalışmaz.');
            } else {
                showDemoToast('Form demo olarak çalıştı. GitHub Pages üzerinde sunucu işlemi yoktur.');
            }
            form.reset();
        }
    });
})();
