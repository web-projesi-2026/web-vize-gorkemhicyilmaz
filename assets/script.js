window.toggleMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        const willOpen = !nav.classList.contains('open');
        hamburger.classList.toggle('active', willOpen);
        nav.classList.toggle('open', willOpen);

        if (!willOpen) {
            document.querySelectorAll('.nav-dropdown.open').forEach((item) => {
                item.classList.remove('open');
                item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            });
            document.getElementById('accountDropdown')?.classList.remove('show');
        }
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
   HTML YAYIN SURUMU ETKILESIMLERI
================================ */
(function() {
    function showSiteToast(message, type = 'success') {
        document.querySelectorAll('.site-toast.site-generated').forEach((el) => el.remove());
        const toast = document.createElement('div');
        toast.className = 'site-toast site-generated ' + (type === 'error' ? 'error' : 'success');
        toast.innerHTML = '<span>' + message + '</span><button type="button" aria-label="Kapat">×</button>';
        toast.querySelector('button').addEventListener('click', () => toast.remove());
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3400);
    }

    window.showSiteToast = showSiteToast;
    window.showToast = showSiteToast;

    function toggleSiteButton(button) {
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

    function createPostCard(content, imageSrc, type, customStamp) {
        const card = document.createElement('div');
        card.className = 'post-card site-created-post';
        const safeText = (content || '').trim() || 'Fotoğraflı gönderi';
        const now = new Date();
        const stamp = customStamp || (now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}));
        card.innerHTML = `
            <div class="post-avatar"><span>GH</span></div>
            <div class="post-content">
                <div class="post-author">Görkem Hiçyılmaz <span>• ${stamp}</span></div>
                <div class="post-badge">${type === 'prompt' ? 'Prompt Paylaşımı' : 'Topluluk Gönderisi'}</div>
                <p class="post-text"></p>
                ${imageSrc ? `<a href="${imageSrc}" target="_blank" rel="noopener" class="post-image-link"><img src="${imageSrc}" alt="Gönderi fotoğrafı" class="post-image"></a>` : ''}
                <div class="post-actions social-post-actions">
                    <button type="button" class="mini-action-btn" data-site-toggle data-active-text="❤️ Beğenildi" data-passive-text="🤍 Beğen">🤍 Beğen <span>0</span></button>
                    <button type="button" class="mini-action-btn" data-site-toggle data-active-text="⭐ Kaydedildi" data-passive-text="☆ Kaydet">☆ Kaydet <span>0</span></button>
                    <span>💬 Yorum yakında</span>
                </div>
            </div>`;
        card.querySelector('.post-text').textContent = safeText;
        return card;
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (window.promptlaLoadHtmlPosts) {
            window.promptlaLoadHtmlPosts(createPostCard);
        }
    });

    window.addEventListener('click', (event) => {
        const toggleBtn = event.target.closest('[data-site-toggle]');
        if (toggleBtn) {
            event.preventDefault();
            toggleSiteButton(toggleBtn);
        }
    });

    window.addEventListener('submit', (event) => {
        const form = event.target;
        if (!form.matches('[data-site-form], [data-site-contact], [data-site-social-form], [data-site-profile-form], [data-site-password-form]')) return;
        event.preventDefault();

        if (form.matches('[data-site-social-form]')) {
            const textarea = form.querySelector('textarea');
            const content = textarea ? textarea.value : '';
            const preview = document.getElementById('postImagePreview');
            const imageSrc = preview && preview.src ? preview.src : '';
            if (!content.trim() && !imageSrc) {
                showSiteToast('Paylaşmak için metin yaz veya fotoğraf seç.', 'error');
                return;
            }
            const typeInput = document.getElementById('postTypeInput');
            const feed = document.querySelector('.social-feed');
            const header = document.querySelector('.feed-header');
            if (feed && header) {
                const postType = typeInput ? typeInput.value : 'genel';
                const stamp = new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
                feed.insertBefore(createPostCard(content, imageSrc, postType, stamp), header.nextSibling);
                if (window.promptlaSaveHtmlPost) window.promptlaSaveHtmlPost({content, imageSrc, type: postType, stamp});
            }
            form.reset();
            if (window.clearSocialImage) window.clearSocialImage();
            if (window.closeCreateModal) window.closeCreateModal();
            showSiteToast('Gönderin sayfaya eklendi.');
            return;
        }

        if (form.matches('[data-site-password-form]')) {
            const current = form.querySelector('[name="currentPassword"]');
            const next = form.querySelector('[name="newPassword"]');
            if (!current || current.value !== '123456') {
                showSiteToast('Mevcut şifre doğrulanamadı. Lütfen doğru şifreyi girin.', 'error');
                return;
            }
            if (!next || next.value.length < 6) {
                showSiteToast('Yeni şifre en az 6 karakter olmalı.', 'error');
                return;
            }
            form.reset();
            showSiteToast('Şifre güncelleme formu doğrulandı.');
            return;
        }

        if (form.matches('[data-site-profile-form]')) {
            showSiteToast('Profil bilgileri kaydedildi.');
            return;
        }

        if (form.matches('[data-site-contact]')) {
            if (window.promptlaOpenMail) window.promptlaOpenMail(form);
            showSiteToast('E-posta istemcin açılıyor. Mesajını kontrol edip gönderebilirsin.');
            form.reset();
            return;
        }

        if (form.matches('[data-site-form]')) {
            if (form.id === 'loginForm' || form.id === 'registerForm' || form.id === 'pageLoginForm' || form.id === 'pageRegisterForm') {
                if (window.closeAuthModal) window.closeAuthModal();
                showSiteToast('Giriş formu başarıyla gönderildi.');
            } else {
                showSiteToast('Form başarıyla gönderildi.');
            }
            form.reset();
        }
    });
})();


/* HTML yayin surumu: sosyal gonderileri tarayici icinde kalici tut */
(function() {
    const STORAGE_KEY = 'promptla_html_posts';

    function readPosts() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch (e) { return []; }
    }

    function savePosts(posts) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.slice(0, 20))); }
        catch (e) { /* localStorage doluysa sessiz gec */ }
    }

    window.promptlaSaveHtmlPost = function(post) {
        const posts = readPosts();
        posts.unshift(post);
        savePosts(posts);
    };

    window.promptlaLoadHtmlPosts = function(createPostCard) {
        const feed = document.querySelector('.social-feed');
        const header = document.querySelector('.feed-header');
        if (!feed || !header || typeof createPostCard !== 'function') return;
        readPosts().reverse().forEach((post) => {
            feed.insertBefore(createPostCard(post.content, post.imageSrc, post.type, post.stamp), header.nextSibling);
        });
    };

    window.promptlaOpenMail = function(form) {
        const name = form.querySelector('[name="ad_soyad"]')?.value || '';
        const email = form.querySelector('[name="eposta"]')?.value || '';
        const subject = form.querySelector('[name="konu"]')?.value || 'PROMPTLA geri bildirim';
        const msg = form.querySelector('[name="mesaj"]')?.value || '';
        const body = `Ad Soyad: ${name}\nE-posta: ${email}\n\nMesaj:\n${msg}`;
        const mailto = `mailto:promptladigital@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    };
})();


/* ================================
   PROMPTLA PLATFORM EKLERI
================================ */
function promptlaIsLoggedIn(){ return localStorage.getItem('promptlaLoggedIn') === '1'; }
function promptlaLoginMock(){ localStorage.setItem('promptlaLoggedIn','1'); showSiteToast('Giriş başarılı. Firebase bağlanınca gerçek oturum kullanılacak.'); }
function promptlaLogout(){ localStorage.removeItem('promptlaLoggedIn'); showSiteToast('Çıkış yapıldı.'); }
window.promptlaLogout = promptlaLogout;
function requirePromptAuth(){ if(!promptlaIsLoggedIn()){ localStorage.setItem('promptlaReturnUrl', location.href); showSiteToast('Promptlara erişmek için önce giriş yapmalısın.'); setTimeout(()=>{ location.href = (location.pathname.includes('/pages/')?'':'pages/') + 'giris-kayit.html'; }, 700); return false; } return true; }
window.openPromptCategoryModal = function(){ document.getElementById('promptCategoryModal')?.classList.add('show'); };
window.closePromptCategoryModal = function(){ document.getElementById('promptCategoryModal')?.classList.remove('show'); };


const PROMPTLA_TOOL_LINKS = {
  'ChatGPT':'https://chatgpt.com/',
  'Gemini':'https://gemini.google.com/',
  'Google Gemini':'https://gemini.google.com/',
  'Claude':'https://claude.ai/',
  'Microsoft Copilot':'https://copilot.microsoft.com/',
  'Copilot':'https://copilot.microsoft.com/',
  'Midjourney':'https://www.midjourney.com/',
  'Kimi':'https://www.kimi.com/en',
  'Kimi AI':'https://www.kimi.com/en',
  'Meshy AI':'https://www.meshy.ai/',
  'Tripo AI':'https://www.tripo3d.ai/',
  'Luma AI':'https://lumalabs.ai/dream-machine',
  'Luma Dream Machine':'https://lumalabs.ai/dream-machine',
  'Spline':'https://spline.design/',
  'Blender + AI eklentileri':'https://www.blender.org/',
  'DALL·E':'https://openai.com/index/dall-e-3/',
  'Leonardo AI':'https://leonardo.ai/',
  'Adobe Firefly':'https://www.adobe.com/products/firefly.html',
  'Runway':'https://runwayml.com/',
  'Pika':'https://pika.art/',
  'Kling':'https://klingai.com/',
  'Kaiber':'https://kaiber.ai/',
  'Notion AI':'https://www.notion.com/product/ai',
  'Grammarly':'https://www.grammarly.com/',
  'Microsoft Word':'https://www.microsoft.com/microsoft-365/word',
  'Google Docs':'https://docs.google.com/',
  'Canva Docs':'https://www.canva.com/docs/',
  'GitHub Copilot':'https://github.com/features/copilot',
  'Cursor':'https://cursor.com/',
  'HTML Canvas':'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
  'JavaScript':'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
};

const PROMPTLA_CATEGORY_INFO = {
  all: { title:'Tüm prompt kategorileri', desc:'Burada farklı üretim türleri için hazırlanmış promptları inceleyebilir, kopyalayabilir ve kendi ihtiyacına göre düzenleyebilirsin.', tools:['ChatGPT','Gemini','Claude','Midjourney','Runway','Meshy AI','Tripo AI'] },
  gorsel: { title:'Görsel oluşturma ve düzenleme promptları', desc:'Görsel üretimi için sahne, ışık, kamera, stil, kompozisyon ve çıktı formatı net yazılmalıdır. Görsel düzenleme promptlarında korunacak ve değişecek alanları ayrıca belirtmek gerekir.', tools:['DALL·E','Midjourney','Leonardo AI','Gemini','Adobe Firefly'] },
  video: { title:'Video promptları', desc:'Video üretiminde sahne süresi, kamera hareketi, ışık, karakter hareketi, geçiş ve son kare açıkça tanımlanmalıdır. Bu alanı daha sonra kendi araç listene göre düzenleyebilirsin.', tools:['Runway','Pika','Kling','Luma Dream Machine','Kaiber'] },
  oyun: { title:'Oyun promptları', desc:'Oyun kategorisi oynanabilir HTML Canvas oyunlarına yönlendirir. Oyun sayfalarında açıklama ve detaylı oluşturma promptu aynı şekilde korunur.', tools:['HTML Canvas','JavaScript','ChatGPT','Claude','Gemini'] },
  '3d': { title:'3D modelleme ve 3D yazıcı promptları', desc:'Bu kategori 3D yazıcıya gönderilebilecek veya 3D sahnelerde kullanılabilecek model fikirleri için ayrılmıştır. Model üretirken ölçü, malzeme hissi, destek ihtiyacı, kenar yumuşatma, baskı yönü ve dosya formatı gibi bilgiler prompta eklenmelidir. Burayı daha sonra kendi 3D modelleme notlarınla genişletebilirsin.', tools:['Meshy AI','Tripo AI','Luma AI','Spline','Blender + AI eklentileri'] },
  odev: { title:'Ödev düzenleme araçları ve akademik çalışma promptları', desc:'Bu kategori PDF oluşturma, Word raporu hazırlama, uzun metni özetleme, sunum planlama, kaynakça düzenleme ve akademik dil iyileştirme gibi işlemler için ayrılmıştır. Burayı daha sonra kendi derslerine ve teslim kurallarına göre düzenleyebilirsin.', tools:['ChatGPT','Claude','Gemini','Microsoft Word','Google Docs','Canva Docs','Notion AI'] },
  kod: { title:'Kodlama, hata ayıklama ve geliştirme promptları', desc:'Kod promptlarında dosya yapısı, hata mesajı, beklenen sonuç ve değiştirilmemesi gereken alanlar net yazılmalıdır.', tools:['ChatGPT','Claude','Gemini','GitHub Copilot','Cursor'] },
  metin: { title:'Metin, içerik ve sosyal medya promptları', desc:'Duyuru, açıklama, e-posta, sosyal medya metni ve blog içeriği gibi yazı üretimlerinde hedef kitle, ton ve uzunluk belirtilmelidir.', tools:['ChatGPT','Claude','Gemini','Notion AI','Grammarly'] }
};
function updatePromptCategoryIntro(cat){
  const info = PROMPTLA_CATEGORY_INFO[cat] || PROMPTLA_CATEGORY_INFO.all;
  const title = document.getElementById('categoryTitle');
  const desc = document.getElementById('categoryDescription');
  const tools = document.getElementById('categoryTools');
  if(title) title.textContent = info.title;
  if(desc) desc.textContent = info.desc;
  if(tools) tools.innerHTML = (info.tools||[]).map(t=>{ const url = PROMPTLA_TOOL_LINKS[t] || '#'; return `<a href="${url}" target="_blank" rel="noopener">${t}<span>↗</span></a>`; }).join('');
}
window.filterPrompts = function(cat){
  if(cat === 'oyun') { location.href = 'games.html'; return; }
  document.querySelectorAll('.prompt-card-modern[data-category]').forEach(card=>{ card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.category !== cat); });
  updatePromptCategoryIntro(cat);
};
window.selectPromptType = function(cat){
  closePromptCategoryModal();
  if(cat === 'oyun') { location.href = 'games.html'; return; }
  filterPrompts(cat);
  const url = new URL(location.href);
  url.searchParams.set('cat', cat);
  history.replaceState(null, '', url.toString());
  document.getElementById('prompt-library')?.scrollIntoView({behavior:'smooth', block:'start'});
};
function initPromptCategoryFromUrl(){
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') || (location.hash ? location.hash.replace('#','') : 'all');
  if(document.querySelector('.prompt-card-modern[data-category]')) filterPrompts(cat);
}
document.addEventListener('DOMContentLoaded', initPromptCategoryFromUrl);


// Kopyalama gibi kritik prompt aksiyonları için giriş kontrolü
window.addEventListener('click', function(e){
  const protectedBtn = e.target.closest('[data-requires-auth]');
  if(protectedBtn && !promptlaIsLoggedIn()){ e.preventDefault(); e.stopPropagation(); requirePromptAuth(); }
}, true);

// Statik auth formları Firebase'e geçişe hazır şekilde localStorage kullanır
window.addEventListener('submit', function(e){
  if(e.target.matches('[data-site-form]')){
    e.preventDefault();
    promptlaLoginMock();
    const returnUrl = localStorage.getItem('promptlaReturnUrl');
    if(returnUrl){ localStorage.removeItem('promptlaReturnUrl'); setTimeout(()=>{ location.href = returnUrl; }, 500); }
  }
});

// Reddit tarzı iç içe yorumlar: localStorage tabanlı, Firebase'e taşınmaya hazır veri modeli
let activeCommentTarget = 'general';
let activeCommentTitle = 'Prompt yorumları';
window.openCommentPanel = function(target, title){
  activeCommentTarget = target || 'general'; activeCommentTitle = title || 'Prompt yorumları';
  const p = document.getElementById('promptComments'); if(!p) return;
  document.getElementById('commentsTitle').textContent = activeCommentTitle + ' yorumları';
  document.getElementById('commentTarget').value = activeCommentTarget;
  p.classList.add('show'); p.scrollIntoView({behavior:'smooth', block:'start'}); renderPromptComments();
};
window.closeCommentPanel = function(){ document.getElementById('promptComments')?.classList.remove('show'); };
function getPromptComments(){ try{return JSON.parse(localStorage.getItem('promptlaComments')||'[]');}catch(e){return [];} }
function setPromptComments(list){ localStorage.setItem('promptlaComments', JSON.stringify(list)); }
window.addPromptComment = function(e){
  e.preventDefault(); if(!requirePromptAuth()) return;
  const text = document.getElementById('commentText').value.trim(); if(!text) return;
  const parentId = document.getElementById('commentParent').value || null;
  const list = getPromptComments();
  list.push({id:'c'+Date.now(), target:activeCommentTarget, parentId, text, user:'Görkem', date:new Date().toLocaleDateString('tr-TR')});
  setPromptComments(list); e.target.reset(); document.getElementById('commentParent').value=''; renderPromptComments();
};
window.replyPromptComment = function(id){ document.getElementById('commentParent').value = id; document.getElementById('commentText').focus(); };
function renderPromptComments(){
  const wrap = document.getElementById('commentsList'); if(!wrap) return;
  const all = getPromptComments().filter(c=>c.target===activeCommentTarget);
  if(!all.length){ wrap.innerHTML = '<p class="site-muted">Henüz yorum yok. İlk yorumu sen yaz.</p>'; return; }
  const byParent = {};
  all.forEach(c=>{ const key=c.parentId||'root'; (byParent[key] ||= []).push(c); });
  function node(parent, depth){ return (byParent[parent]||[]).map(c=>`<div class="comment-node depth-${Math.min(depth,3)}"><div class="comment-meta">${c.user} • ${c.date}</div><p>${c.text.replace(/[<>&]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[m]))}</p><div class="comment-actions"><button class="mini-action-btn" onclick="replyPromptComment('${c.id}')">Yanıtla</button></div>${node(c.id, depth+1)}</div>`).join(''); }
  wrap.innerHTML = node('root',0);
}

// Admin panel sekmeleri
window.addEventListener('click', function(e){
  const btn = e.target.closest('[data-admin-tab]'); if(!btn) return;
  const tab = btn.dataset.adminTab;
  document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.toggle('active', b===btn));
  document.querySelectorAll('.admin-tab').forEach(p=>p.classList.toggle('active', p.id === 'admin-' + tab));
});


/* Improved mobile Promptlar dropdown interaction: close siblings and keep state clean. */
(function () {
    const setupPromptMenuAnimation = () => {
        document.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
            if (toggle.dataset.promptDropdownAnimationReady === '1') return;
            toggle.dataset.promptDropdownAnimationReady = '1';
            toggle.setAttribute('aria-expanded', 'false');

            toggle.addEventListener('click', (event) => {
                const dropdown = toggle.closest('.nav-dropdown');
                if (!dropdown || !window.matchMedia('(max-width: 768px)').matches) return;

                event.preventDefault();
                event.stopPropagation();

                const willOpen = !dropdown.classList.contains('open');
                document.querySelectorAll('.nav-dropdown.open').forEach((item) => {
                    if (item !== dropdown) {
                        item.classList.remove('open');
                        const otherToggle = item.querySelector('.nav-dropdown-toggle');
                        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                    }
                });

                dropdown.classList.toggle('open', willOpen);
                toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPromptMenuAnimation);
    } else {
        setupPromptMenuAnimation();
    }
})();
