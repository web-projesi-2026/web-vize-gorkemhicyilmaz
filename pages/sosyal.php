<?php
session_start();
require_once '../assets/baglanti.php';

$girisYapti = isset($_SESSION['kullanici_id']);

$toastMesaj = '';
$toastTip = 'success';

if (isset($_GET['durum'])) {
    if ($_GET['durum'] === 'gonderi_paylasildi') {
        $toastMesaj = 'Gönderin başarıyla paylaşıldı.';
    } elseif ($_GET['durum'] === 'gonderi_silindi') {
        $toastMesaj = 'Gönderi başarıyla silindi.';
    } elseif ($_GET['durum'] === 'yetkisiz') {
        $toastMesaj = 'Bu işlem için yetkin yok.';
        $toastTip = 'error';
    } elseif ($_GET['durum'] === 'giris_gerekli') {
        $toastMesaj = 'Gönderi paylaşmak için giriş yapmalısın.';
        $toastTip = 'error';
    } elseif ($_GET['durum'] === 'bos_gonderi') {
        $toastMesaj = 'Gönderi içeriği boş olamaz.';
        $toastTip = 'error';
    } elseif ($_GET['durum'] === 'gecersiz') {
        $toastMesaj = 'Geçersiz işlem.';
        $toastTip = 'error';
    }
}

$sorgu = $db->query("
    SELECT 
        sg.*,
        k.ad_soyad
    FROM sosyal_gonderiler sg
    INNER JOIN kullanicilar k ON sg.kullanici_id = k.id
    ORDER BY sg.id DESC
");
$gonderiler = $sorgu->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sosyal - PROMPTLA</title>
    <link rel="stylesheet" href="../assets/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="site-shell">

<?php if ($toastMesaj !== ''): ?>
    <div class="site-toast <?= htmlspecialchars($toastTip) ?>">
        <span><?= htmlspecialchars($toastMesaj) ?></span>
        <button type="button" onclick="this.parentElement.remove()">×</button>
    </div>
<?php endif; ?>

<header>
    <div class="logo">PROMPT<span>LA</span></div>

    <div class="hamburger" id="hamburger" onclick="window.toggleMenu()">
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
                    <button class="account-btn" onclick="window.toggleDropdown(event)">
                        <?= htmlspecialchars(explode(' ', $_SESSION['kullanici_adi'])[0]) ?>
                    </button>
                    <div class="account-dropdown" id="accountDropdown">
                        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin'): ?>
                            <a href="../admin.php">Admin Paneli</a>
                        <?php endif; ?>
                        <a href="../assets/islem.php?cikis=1">Çıkış Yap</a>
                    </div>
                <?php else: ?>
                    <button class="account-btn" onclick="window.toggleDropdown(event)">
                        Hesap
                    </button>
                    <div class="account-dropdown" id="accountDropdown">
                        <a href="#" onclick="window.openAuthModal('login'); return false;">Giriş Yap</a>
                        <a href="#" onclick="window.openAuthModal('register'); return false;">Kayıt Ol</a>
                    </div>
                <?php endif; ?>
            </li>
        </ul>
    </nav>
</header>

<div class="social-container">
    <div class="social-sidebar">
        <?php if ($girisYapti): ?>
            <button class="create-fab" onclick="window.openCreateModal()">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Oluştur
            </button>
        <?php endif; ?>
    </div>

    <div class="social-feed">
        <div class="feed-header">
            <h2>Topluluk Akışı</h2>
        </div>

        <?php if (!empty($gonderiler)): ?>
            <?php foreach ($gonderiler as $gonderi): ?>
                <div class="post-card">
                    <div class="post-avatar">
                        <?= strtoupper(mb_substr($gonderi['ad_soyad'], 0, 1, 'UTF-8')) ?>
                    </div>

                    <div class="post-content">
                        <div class="post-author">
                            <?= htmlspecialchars($gonderi['ad_soyad']) ?>
                            <span>• <?= date('d.m.Y H:i', strtotime($gonderi['olusturma_tarihi'])) ?></span>
                        </div>

                        <div class="post-badge">
                            <?= $gonderi['gonderi_turu'] === 'prompt' ? 'Prompt Paylaşımı' : 'Topluluk Gönderisi' ?>
                        </div>

                        <p class="post-text"><?= nl2br(htmlspecialchars($gonderi['icerik'])) ?></p>

                        <div class="post-actions">
                            <span>❤️ Etkileşim</span>
                            <span>💬 Yorum yakında</span>
                            <span>⭐ Kaydet yakında</span>

                            <?php if ($girisYapti && isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin'): ?>
                                <a
                                    href="../assets/islem.php?sosyal_sil=<?= (int)$gonderi['id'] ?>"
                                    onclick="return confirm('Bu gönderi silinsin mi?')"
                                    class="post-admin-delete"
                                >
                                    Sil
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="post-card">
                <div class="post-content">
                    <p class="post-text">Henüz paylaşım yapılmadı. İlk gönderiyi sen oluştur.</p>
                </div>
            </div>
        <?php endif; ?>
    </div>

    <div class="social-right"></div>
</div>

<?php if ($girisYapti): ?>
<div id="createModal" class="modal">
    <div class="modal-content create-modal-content social-create-modal">
        <span class="close-btn" onclick="window.closeCreateModal()">&times;</span>

        <div class="social-create-header">
            <span class="eyebrow" style="margin-bottom:8px;">SOSYAL PAYLAŞIM</span>
            <h2>Yeni Gönderi</h2>
            <p>Ne paylaşmak istediğini seç ve içeriğini ekle.</p>
        </div>

        <form action="../assets/islem.php" method="POST" class="social-create-form">
            <input type="hidden" name="post_type" id="postTypeInput" value="prompt">

            <div class="post-type-switch">
                <button type="button" class="post-type-btn active" data-type="prompt">
                    Prompt Paylaşımı
                </button>
                <button type="button" class="post-type-btn" data-type="genel">
                    Topluluk Gönderisi
                </button>
            </div>

            <textarea
                name="post_content"
                rows="7"
                placeholder="Paylaşımını yaz..."
                required
                class="social-create-textarea"
            ></textarea>

            <button type="submit" name="gonderi_paylas" class="social-submit-btn">PAYLAŞ</button>
        </form>
    </div>
</div>
<?php endif; ?>

<?php if (!$girisYapti): ?>
<div id="authModal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="window.closeAuthModal()">&times;</span>

        <div class="auth-tabs">
            <button class="tab-btn active" id="tab-login" onclick="window.switchAuthTab('login')">Giriş Yap</button>
            <button class="tab-btn" id="tab-register" onclick="window.switchAuthTab('register')">Kayıt Ol</button>
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