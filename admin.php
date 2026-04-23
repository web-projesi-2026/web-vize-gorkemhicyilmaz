<?php
session_start();
require_once 'assets/baglanti.php';

if (!isset($_SESSION['kullanici_id']) || $_SESSION['rol'] !== 'admin') {
    header("Location: index.php");
    exit();
}

$duzenlenecekPrompt = null;

if (isset($_GET['duzenle'])) {
    $duzenleId = (int)$_GET['duzenle'];

    $duzenleSorgu = $db->prepare("SELECT * FROM prompts WHERE id = ?");
    $duzenleSorgu->execute([$duzenleId]);
    $duzenlenecekPrompt = $duzenleSorgu->fetch(PDO::FETCH_ASSOC);
}

$promptlar = $db->query("SELECT * FROM prompts ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PROMPTLA - Yönetim Paneli</title>
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
            <li><a href="index.php">Ana Sayfa</a></li>
            <li><a href="index.php#ai-cards">Yapay Zeka Modelleri</a></li>
            <li><a href="pages/prompt.php">Promptlar</a></li>
            <li><a href="pages/sosyal.php" class="nav-highlight">Sosyal</a></li>
            <li class="account-menu">
                <button class="account-btn" onclick="toggleDropdown(event)">
                    <?= htmlspecialchars(explode(' ', $_SESSION['kullanici_adi'])[0]) ?>
                </button>
                <div class="account-dropdown" id="accountDropdown">
                    <a href="admin.php">Admin Paneli</a>
                    <a href="assets/islem.php?cikis=1">Çıkış Yap</a>
                </div>
            </li>
        </ul>
    </nav>
</header>

<section class="section-block">
    <div class="container" style="max-width: 1200px;">
        <div class="section-heading" style="margin-bottom:30px;">
            <span class="eyebrow">YÖNETİM PANELİ</span>
            <h2><?= $duzenlenecekPrompt ? 'Prompt Düzenle' : 'Yeni Prompt Ekle' ?></h2>
            <p>
                Prompt içeriklerini tek panelden ekleyebilir, düzenleyebilir, görselleri güncelleyebilir ve yayındaki içerikleri yönetebilirsin.
            </p>
        </div>

        <div class="step-card admin-form-card">
            <form action="assets/islem.php" method="POST" enctype="multipart/form-data" class="admin-form">
                <?php if ($duzenlenecekPrompt): ?>
                    <input type="hidden" name="prompt_id" value="<?= (int)$duzenlenecekPrompt['id'] ?>">
                    <input type="hidden" name="mevcut_gorsel" value="<?= htmlspecialchars($duzenlenecekPrompt['yeni_gorsel']) ?>">
                <?php endif; ?>

                <input
                    type="text"
                    name="baslik"
                    placeholder="Başlık"
                    required
                    value="<?= $duzenlenecekPrompt ? htmlspecialchars($duzenlenecekPrompt['baslik']) : '' ?>"
                >

                <?php
                $kategoriler = ['tasarim', 'analiz', 'egitim', 'yazilim', 'genel'];
                $seciliKategori = $duzenlenecekPrompt['kategori'] ?? '';
                ?>
                <select name="kategori" required>
                    <option value="">Kategori seç</option>
                    <?php foreach ($kategoriler as $kategori): ?>
                        <option value="<?= $kategori ?>" <?= $seciliKategori === $kategori ? 'selected' : '' ?>>
                            <?= ucfirst($kategori) ?>
                        </option>
                    <?php endforeach; ?>
                </select>

                <textarea
                    name="prompt_metni"
                    rows="7"
                    placeholder="Prompt içeriği"
                    required
                ><?= $duzenlenecekPrompt ? htmlspecialchars($duzenlenecekPrompt['prompt_metni']) : '' ?></textarea>

                <?php if ($duzenlenecekPrompt && !empty($duzenlenecekPrompt['yeni_gorsel'])): ?>
                    <div class="admin-current-image-box">
                        <img
                            src="<?= htmlspecialchars($duzenlenecekPrompt['yeni_gorsel']) ?>"
                            alt="Mevcut görsel"
                            class="admin-current-image"
                        >
                        <div class="admin-current-image-info">
                            <p class="admin-current-image-title">Mevcut görsel</p>
                            <p>Yeni görsel yüklersen eski görsel bununla değiştirilir.</p>
                        </div>
                    </div>
                <?php endif; ?>

                <input type="file" name="yeni_gorsel" accept="image/*">

                <div class="admin-form-actions">
                    <?php if ($duzenlenecekPrompt): ?>
                        <button type="submit" name="prompt_guncelle" class="btn">Değişiklikleri Kaydet</button>
                        <a href="admin.php" class="btn btn-secondary">İptal</a>
                    <?php else: ?>
                        <button type="submit" name="prompt_ekle" class="btn">Prompt Ekle</button>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <div class="step-card admin-list-card">
            <h3 class="admin-section-title">Mevcut Promptlar</h3>

            <?php if (!empty($promptlar)): ?>
                <div class="admin-prompt-list">
                    <?php foreach ($promptlar as $prompt): ?>
                        <div class="admin-prompt-item">
                            <div class="admin-prompt-main">
                                <h3><?= htmlspecialchars($prompt['baslik']) ?></h3>
                                <p class="admin-prompt-category"><?= htmlspecialchars($prompt['kategori']) ?></p>
                                <p class="admin-prompt-text"><?= nl2br(htmlspecialchars($prompt['prompt_metni'])) ?></p>

                                <?php if (!empty($prompt['eklenme_tarihi'])): ?>
                                    <p class="admin-prompt-date">
                                        Eklenme: <?= date('d.m.Y H:i', strtotime($prompt['eklenme_tarihi'])) ?>
                                    </p>
                                <?php endif; ?>
                            </div>

                            <div class="admin-prompt-side">
                                <?php if (!empty($prompt['yeni_gorsel'])): ?>
                                    <img
                                        src="<?= htmlspecialchars($prompt['yeni_gorsel']) ?>"
                                        alt="Prompt görseli"
                                        class="admin-prompt-image"
                                    >
                                <?php endif; ?>

                                <a
                                    href="admin.php?duzenle=<?= (int)$prompt['id'] ?>"
                                    class="admin-edit-btn"
                                >
                                    Düzenle
                                </a>

                                <a
                                    href="assets/islem.php?prompt_sil=<?= (int)$prompt['id'] ?>"
                                    onclick="return confirm('Bu prompt silinsin mi?')"
                                    class="admin-delete-btn"
                                >
                                    Sil
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <p style="color:#98a6c7;">Henüz kayıtlı prompt yok.</p>
            <?php endif; ?>
        </div>
    </div>
</section>

<script src="assets/script.js"></script>
</body>
</html>