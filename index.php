<?php
session_start();
require_once 'assets/helpers.php';

$girisYapti = isset($_SESSION['kullanici_id']);

$heroImages = [
    [
        'title' => 'Lego Stil Karakter Promptu',
        'text'  => 'Gerçek fotoğrafı oyuncak estetiğine dönüştüren yaratıcı prompt örneği.',
        'image' => resolveImage('prompt1')
    ],
    [
        'title' => 'Teknoloji Ürün İnfoğrafiği',
        'text'  => 'Bir ürünü teknik ve estetik olarak anlatan düzenli görsel dil.',
        'image' => resolveImage('urun1')
    ],
    [
        'title' => 'Blueprint Analiz Tasarımı',
        'text'  => 'Teknik çizim hissi veren analiz afişleri için güçlü referans görsel.',
        'image' => resolveImage('urun2')
    ]
];

$heroImages = array_values(array_filter($heroImages, fn($item) => !empty($item['image'])));
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROMPTLA - Yapay Zeka Modelleri ve Prompt Eğitimi</title>
    <meta name="description" content="PROMPTLA ile yapay zeka modellerini keşfet, prompt yazmayı öğren ve görsel örneklerle geliş.">
    <link rel="stylesheet" href="assets/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="site-shell">

<header>
    <div class="logo">PROMPT<span>LA</span></div>

    <div class="hamburger" id="hamburger" onclick="toggleMenu()">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>

    <nav>
        <ul id="menu">
            <li><a href="#hero">Ana Sayfa</a></li>
            <li><a href="#ai-cards">Yapay Zeka Modelleri</a></li>
            <li><a href="pages/prompt.php">Promptlar</a></li>
            <li><a href="pages/sosyal.php" class="nav-highlight">Sosyal</a></li>

            <li class="account-menu">
                <?php if ($girisYapti): ?>
                    <button class="account-btn" onclick="toggleDropdown(event)">
                        <?= htmlspecialchars(explode(' ', $_SESSION['kullanici_adi'])[0]) ?>
                    </button>
                    <div class="account-dropdown" id="accountDropdown">
                        <?php if ($_SESSION['rol'] === 'admin'): ?>
                            <a href="admin.php">Admin Paneli</a>
                        <?php endif; ?>
                        <a href="assets/islem.php?cikis=1">Çıkış Yap</a>
                    </div>
                <?php else: ?>
                    <button class="account-btn" onclick="toggleDropdown(event)">
                        Hesap
                    </button>
                    <div class="account-dropdown" id="accountDropdown">
                        <a href="javascript:void(0)" onclick="openAuthModal('login')">Giriş Yap</a>
                        <a href="javascript:void(0)" onclick="openAuthModal('register')">Kayıt Ol</a>
                    </div>
                <?php endif; ?>
            </li>
        </ul>
    </nav>
</header>

<section id="hero" class="hero-clean">
    <div class="hero-bg-grid"></div>

    <div class="hero-left">
        <span class="eyebrow">YAPAY ZEKA • EĞİTİM • PROMPT • TOPLULUK</span>
        <h1>Yapay zekayı sadece kullanma, mantığını da öğren.</h1>
        <p>
            PROMPTLA; yapay zeka araçlarını tanıtan, prompt yazım mantığını öğreten,
            örnek üretimleri gösteren ve kullanıcıların paylaşım yapabildiği modern bir öğrenme platformudur.
        </p>

        <div class="hero-buttons">
            <a href="#ai-cards" class="btn">Modelleri İncele</a>
            <a href="pages/prompt.php" class="btn btn-secondary">Promptlara Git</a>
        </div>

        <div class="hero-info-cards">
            <div class="hero-info-card">
                <strong>Model Rehberi</strong>
                <span>Hangi araç ne için kullanılır?</span>
            </div>
            <div class="hero-info-card">
                <strong>Prompt Eğitimi</strong>
                <span>Örneklerle mantığı öğren</span>
            </div>
            <div class="hero-info-card">
                <strong>Topluluk</strong>
                <span>Paylaş, incele, geliş</span>
            </div>
        </div>
    </div>

    <div class="hero-right">
        <?php if (!empty($heroImages)): ?>
            <div class="hero-slider-box">
                <?php foreach ($heroImages as $index => $item): ?>
                    <div class="hero-slide <?= $index === 0 ? 'active' : '' ?>">
                        <div class="hero-image-frame">
                            <img src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['title']) ?>">
                        </div>
                        <div class="hero-image-text">
                            <h3><?= htmlspecialchars($item['title']) ?></h3>
                            <p><?= htmlspecialchars($item['text']) ?></p>
                        </div>
                    </div>
                <?php endforeach; ?>

                <div class="hero-dots">
                    <?php foreach ($heroImages as $index => $item): ?>
                        <button
                            type="button"
                            class="hero-dot <?= $index === 0 ? 'active' : '' ?>"
                            onclick="setHeroSlide(<?= $index ?>)"
                            aria-label="Görsel <?= $index + 1 ?>"
                        ></button>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php else: ?>
            <div class="hero-empty-box">
                <span>images klasörüne prompt1, urun1, urun2 görsellerini eklediğinde burada otomatik gösterilecek.</span>
            </div>
        <?php endif; ?>
    </div>
</section>

<section id="how-to" class="section-block">
    <div class="container">
        <div class="section-heading">
            <span class="eyebrow">ÖĞRENME MANTIĞI</span>
            <h2>Yapay zekadan daha iyi sonuç almanın temel yapısı</h2>
            <p>İyi sonuç; doğru modeli seçmek, doğru prompt yazmak ve doğru format istemekle gelir.</p>
        </div>

        <div class="steps-grid">
            <div class="step-card">
                <div class="step-no">01</div>
                <h3>Bağlam ver</h3>
                <p>Modele kim olduğunu, hangi konuda konuştuğunu ve hangi çerçevede yanıt vermesi gerektiğini söyle.</p>
            </div>

            <div class="step-card">
                <div class="step-no">02</div>
                <h3>Görevi net tanımla</h3>
                <p>Metin mi, analiz mi, kod mu, görsel fikri mi istediğini doğrudan belirt.</p>
            </div>

            <div class="step-card">
                <div class="step-no">03</div>
                <h3>Formatı sabitle</h3>
                <p>Madde madde, kısa, detaylı, tablo halinde ya da öğretici biçimde istemek sonucu güçlendirir.</p>
            </div>
        </div>
    </div>
</section>

<section id="ai-cards" class="section-block">
    <div class="container-wide">
        <div class="section-heading">
            <span class="eyebrow">MODEL REHBERİ</span>
            <h2>Temel yapay zeka araçları</h2>
            <p>Bu bölümde amaç fiyat ezberletmek değil; hangi modelin hangi işte işine yarayacağını öğretmektir.</p>
        </div>

        <div class="model-grid">
            <div class="model-card">
                <div class="card-header">ChatGPT</div>
                <p>Genel amaçlı kullanım, içerik üretimi, öğrenme, açıklama ve fikir geliştirme için güçlü bir başlangıç modelidir.</p>
                <span class="usage-badge">Kullanım: “Bana adım adım öğret.”</span>
                <a href="pages/chatgpt.php" class="card-btn">Ayrıntılı İncele</a>
            </div>

            <div class="model-card">
                <div class="card-header">Microsoft Copilot</div>
                <p>Belge üretimi, ofis iş akışı ve kurumsal kullanım senaryolarında anlamlı avantajlar sunar.</p>
                <span class="usage-badge">Kullanım: “Bu raporu sadeleştir.”</span>
                <a href="pages/copilot.php" class="card-btn">Ayrıntılı İncele</a>
            </div>

            <div class="model-card">
                <div class="card-header">Google Gemini</div>
                <p>Çok modlu çalışma, geniş bağlam ve Google servisleriyle birlikte kullanım tarafında dikkat çeker.</p>
                <span class="usage-badge">Kullanım: “Bu görseli ve metni birlikte yorumla.”</span>
                <a href="pages/gemini.php" class="card-btn">Ayrıntılı İncele</a>
            </div>

            <div class="model-card">
                <div class="card-header">Claude</div>
                <p>Uzun metin okuma, açıklama yapma ve daha sakin, düzenli çıktı üretme tarafında güçlüdür.</p>
                <span class="usage-badge">Kullanım: “Bu metni daha anlaşılır hale getir.”</span>
                <a href="pages/claude.php" class="card-btn">Ayrıntılı İncele</a>
            </div>

            <div class="model-card">
                <div class="card-header">Midjourney</div>
                <p>Sanatsal yönü güçlü, estetik ve atmosferli görseller üretmek isteyenler için önemli bir araçtır.</p>
                <span class="usage-badge">Kullanım: “/imagine cinematic neon city”</span>
                <a href="pages/midjourney.php" class="card-btn">Ayrıntılı İncele</a>
            </div>

            <div class="model-card">
                <div class="card-header">Kimi</div>
                <p>Uzun içerik işleme ve analiz mantığını incelemek isteyen kullanıcılar için ilgi çekici bir alternatiftir.</p>
                <span class="usage-badge">Kullanım: “Bu içeriği analiz edip akış çıkar.”</span>
                <a href="pages/kimi.php" class="card-btn">Ayrıntılı İncele</a>
            </div>
        </div>
    </div>
</section>

<section id="iletisim" class="section-block">
    <div class="container">
        <div class="section-heading">
            <span class="eyebrow">İLETİŞİM</span>
            <h2>Geri bildirim gönder</h2>
            <p>Site hakkındaki görüşlerini, önerilerini veya sorularını bizimle paylaşabilirsin.</p>
        </div>

        <?php if (isset($_GET['iletisim'])): ?>
            <?php if ($_GET['iletisim'] === 'basarili'): ?>
                <div class="form-message success">Mesajın başarıyla gönderildi.</div>
            <?php elseif ($_GET['iletisim'] === 'hata'): ?>
                <div class="form-message error">Lütfen tüm alanları doğru doldur.</div>
            <?php endif; ?>
        <?php endif; ?>

        <form action="assets/islem.php" method="POST" class="contact-form">
            <input type="text" name="ad_soyad" placeholder="Adınız Soyadınız" required>

            <input type="email" name="eposta" placeholder="E-posta adresiniz" required>

            <input type="text" name="konu" placeholder="Konu" required>

            <textarea name="mesaj" placeholder="Mesajınızı yazın" required></textarea>

            <button type="submit" name="iletisim_gonder" class="btn">Gönder</button>
        </form>
    </div>
</section>


<footer id="contact">
    <div class="footer-about">
        <h3>PROMPTLA Hakkında</h3>
        <p>
            PROMPTLA, yapay zeka araçlarını tanıtmayı, prompt yazım becerisini geliştirmeyi
            ve kullanıcıların örnek üretimlerini paylaşmasını hedefleyen modern bir eğitim platformudur.
        </p>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 PROMPTLA. Tüm Hakları Saklıdır.</p>
        <div class="socials">
            <span>Instagram</span> • <span>X</span> • <span>LinkedIn</span>
        </div>
    </div>
</footer>

<?php if (!$girisYapti): ?>
<div id="authModal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeAuthModal()">&times;</span>
        <div class="auth-tabs">
            <button class="tab-btn active" id="tab-login" onclick="switchAuthTab('login')">Giriş Yap</button>
            <button class="tab-btn" id="tab-register" onclick="switchAuthTab('register')">Kayıt Ol</button>
        </div>

        <form id="loginForm" class="auth-form active" action="assets/islem.php" method="POST">
            <div class="divider"><span>klasik giriş</span></div>
            <input type="email" name="loginEmail" placeholder="E-posta adresiniz" required>
            <input type="password" name="loginPassword" placeholder="Şifreniz" required>
            <button type="submit" name="giris_yap" class="btn btn-full">Giriş Yap</button>
        </form>

        <form id="registerForm" class="auth-form" action="assets/islem.php" method="POST">
            <div class="divider"><span>yeni hesap oluştur</span></div>
            <input type="text" name="registerName" placeholder="Adınız Soyadınız" required>
            <input type="email" name="registerEmail" placeholder="E-posta adresiniz" required>
            <input type="password" name="registerPassword" placeholder="Şifre belirleyin" required>
            <button type="submit" name="kayit_ol" class="btn btn-full">Kayıt Ol</button>
        </form>
    </div>
</div>
<?php endif; ?>

<script src="assets/script.js"></script>
</body>
</html>