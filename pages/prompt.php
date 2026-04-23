<?php
session_start();
require_once '../assets/baglanti.php';

$girisYapti = isset($_SESSION['kullanici_id']);

/* Kategori filtreleme */
$seciliKategori = isset($_GET['kategori']) ? trim($_GET['kategori']) : '';

/* Kategorileri çek */
$kategoriSorgu = $db->query("SELECT DISTINCT kategori FROM prompts WHERE kategori IS NOT NULL AND kategori != '' ORDER BY kategori ASC");
$kategoriler = $kategoriSorgu->fetchAll(PDO::FETCH_COLUMN);

/* Promptları çek */
if ($seciliKategori !== '') {
    $sorgu = $db->prepare("SELECT * FROM prompts WHERE kategori = ? ORDER BY id DESC");
    $sorgu->execute([$seciliKategori]);
} else {
    $sorgu = $db->query("SELECT * FROM prompts ORDER BY id DESC");
}
$promptlar = $sorgu->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Kütüphanesi - PROMPTLA</title>
    <meta name="description" content="Aradığın promptları keşfet, örnekleri incele ve projelerinde doğrudan kullan.">
    <link rel="stylesheet" href="../assets/style.css">
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
            <li><a href="../index.php">Ana Sayfa</a></li>
            <li><a href="../index.php#ai-cards">Yapay Zeka Modelleri</a></li>
            <li><a href="prompt.php">Promptlar</a></li>
            <li><a href="sosyal.php" class="nav-highlight">Sosyal</a></li>

            <li class="account-menu">
                <?php if ($girisYapti): ?>
                    <button class="account-btn" onclick="toggleDropdown(event)">
                        <?= htmlspecialchars(explode(' ', $_SESSION['kullanici_adi'])[0]) ?>
                    </button>
                    <div class="account-dropdown" id="accountDropdown">
                        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin'): ?>
                            <a href="../admin.php">Admin Paneli</a>
                        <?php endif; ?>
                        <a href="../assets/islem.php?cikis=1">Çıkış Yap</a>
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

<section id="prompt-library" class="prompt-library-modern">
    <div class="container">
        <div class="section-heading">
            <span class="eyebrow">PROMPT KÜTÜPHANESİ</span>
            <h2>Aradığın promptları keşfet</h2>
            <p>
                Farklı kullanım senaryolarına göre hazırlanmış promptları inceleyebilir,
                kendi projelerin için ilham alabilir ve doğrudan kullanabilirsin.
            </p>
        </div>

        <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:12px; margin-bottom:35px;">
            <a href="prompt.php"
               style="text-decoration:none; padding:10px 16px; border-radius:999px; border:1px solid rgba(0,217,255,0.20); color:<?= $seciliKategori === '' ? '#06121a' : '#00d9ff' ?>; background:<?= $seciliKategori === '' ? '#00d9ff' : 'rgba(0,217,255,0.06)' ?>; font-weight:700;">
               Tümü
            </a>

            <?php foreach ($kategoriler as $kategori): ?>
                <a href="prompt.php?kategori=<?= urlencode($kategori) ?>"
                   style="text-decoration:none; padding:10px 16px; border-radius:999px; border:1px solid rgba(0,217,255,0.20); color:<?= $seciliKategori === $kategori ? '#06121a' : '#00d9ff' ?>; background:<?= $seciliKategori === $kategori ? '#00d9ff' : 'rgba(0,217,255,0.06)' ?>; font-weight:700;">
                   <?= htmlspecialchars($kategori) ?>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="prompt-grid-modern">
            <?php if (!empty($promptlar)): ?>
                <?php foreach ($promptlar as $prompt): ?>
                    <article class="prompt-card-modern">
                        <div class="prompt-card-image">
                            <?php if (!empty($prompt['yeni_gorsel'])): ?>
                                <img src="../<?= htmlspecialchars($prompt['yeni_gorsel']) ?>" alt="<?= htmlspecialchars($prompt['baslik']) ?>">
                            <?php else: ?>
                                <div class="prompt-image-placeholder">
                                    <span>Görsel bulunamadı</span>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="prompt-card-content">
                            <span class="prompt-chip"><?= htmlspecialchars($prompt['kategori']) ?></span>

                            <h3><?= htmlspecialchars($prompt['baslik']) ?></h3>

                            <?php if (!empty($prompt['eklenme_tarihi'])): ?>
                                <p style="color:#7f8cab; font-size:0.88rem; margin-bottom:14px;">
                                    Eklenme: <?= date('d.m.Y H:i', strtotime($prompt['eklenme_tarihi'])) ?>
                                </p>
                            <?php endif; ?>

                            <div class="prompt-code-box">
                                <strong>Örnek Prompt</strong>
                                <p><?= nl2br(htmlspecialchars($prompt['prompt_metni'])) ?></p>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            <?php else: ?>
                <div style="grid-column:1 / -1; text-align:center; padding:40px 20px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:20px;">
                    <h3 style="margin-bottom:10px;">Henüz prompt bulunmuyor</h3>
                    <p style="color:#98a6c7;">
                        Yakında burada farklı kategorilerde yeni prompt örnekleri yer alacak.
                    </p>
                </div>
            <?php endif; ?>
        </div>

        <a href="../index.php" class="back-btn" style="margin-top: 50px;">← Ana Sayfaya Dön</a>
    </div>
</section>

<footer id="contact">
    <div class="footer-about">
        <h3>PROMPTLA Hakkında</h3>
        <p>
            PROMPTLA, yapay zeka araçlarını tanıtan, prompt yazım mantığını örneklerle öğreten
            ve kullanıcıların kendi üretimlerinden ilham almasını sağlayan modern bir öğrenme platformudur.
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

        <form id="loginForm" class="auth-form active" action="../assets/islem.php" method="POST">
            <div class="divider"><span>klasik giriş</span></div>
            <input type="email" name="loginEmail" placeholder="E-posta adresiniz" required>
            <input type="password" name="loginPassword" placeholder="Şifreniz" required>
            <button type="submit" name="giris_yap" class="btn btn-full">Giriş Yap</button>
        </form>

        <form id="registerForm" class="auth-form" action="../assets/islem.php" method="POST">
            <div class="divider"><span>yeni hesap oluştur</span></div>
            <input type="text" name="registerName" placeholder="Adınız Soyadınız" required>
            <input type="email" name="registerEmail" placeholder="E-posta adresiniz" required>
            <input type="password" name="registerPassword" placeholder="Şifre belirleyin" required>
            <button type="submit" name="kayit_ol" class="btn btn-full">Kayıt Ol</button>
        </form>
    </div>
</div>
<?php endif; ?>

<script src="../assets/script.js"></script>
</body>
</html>