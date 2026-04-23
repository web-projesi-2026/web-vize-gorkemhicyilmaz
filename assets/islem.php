<?php
session_start();
require_once 'baglanti.php';

function geriDon($mesaj, $yol = null) {
    $hedef = $yol ? $yol : ($_SERVER['HTTP_REFERER'] ?? '../index.php');
    echo "<script>alert(" . json_encode($mesaj) . "); window.location.href=" . json_encode($hedef) . ";</script>";
    exit();
}

function adminMi() {
    return isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin';
}

function guvenliDosyaYukle($dosyaAlani) {
    if (!isset($_FILES[$dosyaAlani]) || $_FILES[$dosyaAlani]['error'] !== 0) {
        return false;
    }

    $izinliUzantilar = ['jpg', 'jpeg', 'png', 'webp'];
    $izinliMime = ['image/jpeg', 'image/png', 'image/webp'];
    $maxBoyut = 5 * 1024 * 1024;

    $tmp = $_FILES[$dosyaAlani]['tmp_name'];
    $orijinalAd = $_FILES[$dosyaAlani]['name'];
    $boyut = $_FILES[$dosyaAlani]['size'];
    $uzanti = strtolower(pathinfo($orijinalAd, PATHINFO_EXTENSION));

    if (!in_array($uzanti, $izinliUzantilar)) {
        geriDon("Sadece JPG, JPEG, PNG ve WEBP yükleyebilirsin.");
    }

    if ($boyut > $maxBoyut) {
        geriDon("Dosya boyutu 5MB'dan büyük olamaz.");
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $tmp);
    finfo_close($finfo);

    if (!in_array($mime, $izinliMime)) {
        geriDon("Geçersiz görsel dosyası.");
    }

    $hedefKlasor = "../images/";
    if (!is_dir($hedefKlasor)) {
        mkdir($hedefKlasor, 0777, true);
    }

    $yeniAd = uniqid("img_", true) . "." . $uzanti;
    $hedefYol = $hedefKlasor . $yeniAd;

    if (!move_uploaded_file($tmp, $hedefYol)) {
        geriDon("Görsel yüklenirken hata oluştu.");
    }

    return "images/" . $yeniAd;
}

/* ---------------- KAYIT OL ---------------- */
if (isset($_POST['kayit_ol'])) {
    $ad_soyad = trim($_POST['registerName'] ?? '');
    $eposta = trim($_POST['registerEmail'] ?? '');
    $sifre = $_POST['registerPassword'] ?? '';

    if ($ad_soyad === '' || $eposta === '' || $sifre === '') {
        geriDon("Lütfen tüm alanları doldur.");
    }

    if (!filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
        geriDon("Geçerli bir e-posta adresi gir.");
    }

    if (strlen($sifre) < 6) {
        geriDon("Şifre en az 6 karakter olmalı.");
    }

    $kontrol = $db->prepare("SELECT id FROM kullanicilar WHERE eposta = ?");
    $kontrol->execute([$eposta]);

    if ($kontrol->fetch()) {
        geriDon("Bu e-posta zaten kayıtlı.");
    }

    $hashli_sifre = password_hash($sifre, PASSWORD_DEFAULT);

    $sorgu = $db->prepare("INSERT INTO kullanicilar (ad_soyad, eposta, sifre, rol) VALUES (?, ?, ?, 'user')");
    $sorgu->execute([$ad_soyad, $eposta, $hashli_sifre]);

    geriDon("Kayıt başarılı. Şimdi giriş yapabilirsin.", "../index.php");
}

/* ---------------- GİRİŞ YAP ---------------- */
if (isset($_POST['giris_yap'])) {
    $eposta = trim($_POST['loginEmail'] ?? '');
    $sifre = $_POST['loginPassword'] ?? '';

    if ($eposta === '' || $sifre === '') {
        geriDon("Lütfen e-posta ve şifreyi doldur.");
    }

    $sorgu = $db->prepare("SELECT * FROM kullanicilar WHERE eposta = ?");
    $sorgu->execute([$eposta]);
    $kullanici = $sorgu->fetch(PDO::FETCH_ASSOC);

    if (!$kullanici) {
        geriDon("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
    }

    if (!password_verify($sifre, $kullanici['sifre'])) {
        geriDon("Şifre yanlış.");
    }

    $_SESSION['kullanici_id'] = $kullanici['id'];
    $_SESSION['kullanici_adi'] = $kullanici['ad_soyad'];
    $_SESSION['rol'] = $kullanici['rol'];

    if ($kullanici['rol'] === 'admin') {
        geriDon("Admin olarak giriş yapıldı.", "../admin.php");
    }

    geriDon("Hoş geldin, " . $kullanici['ad_soyad'] . "!", "../index.php");
}

/* ---------------- ÇIKIŞ YAP ---------------- */
if (isset($_GET['cikis']) && $_GET['cikis'] == '1') {
    session_unset();
    session_destroy();
    geriDon("Başarıyla çıkış yapıldı.", "../index.php");
}

/* ---------------- ADMIN PROMPT EKLE ---------------- */
if (isset($_POST['prompt_ekle'])) {
    if (!adminMi()) {
        geriDon("Yetkisiz erişim.");
    }

    $baslik = trim($_POST['baslik'] ?? '');
    $kategori = trim($_POST['kategori'] ?? '');
    $prompt_metni = trim($_POST['prompt_metni'] ?? '');

    if ($baslik === '' || $kategori === '' || $prompt_metni === '') {
        geriDon("Tüm alanları doldur.");
    }

    $gorselYolu = guvenliDosyaYukle('yeni_gorsel');
    if (!$gorselYolu) {
        geriDon("Lütfen bir görsel seç.");
    }

    $sorgu = $db->prepare("INSERT INTO prompts (baslik, kategori, prompt_metni, yeni_gorsel) VALUES (?, ?, ?, ?)");
    $sorgu->execute([$baslik, $kategori, $prompt_metni, $gorselYolu]);

    geriDon("Prompt başarıyla eklendi.", "../admin.php");
}

/* ---------------- ADMIN PROMPT GÜNCELLE ---------------- */
if (isset($_POST['prompt_guncelle'])) {
    if (!adminMi()) {
        geriDon("Yetkisiz erişim.");
    }

    $id = (int)($_POST['prompt_id'] ?? 0);
    $baslik = trim($_POST['baslik'] ?? '');
    $kategori = trim($_POST['kategori'] ?? '');
    $prompt_metni = trim($_POST['prompt_metni'] ?? '');
    $mevcutGorsel = trim($_POST['mevcut_gorsel'] ?? '');

    if ($id <= 0 || $baslik === '' || $kategori === '' || $prompt_metni === '') {
        geriDon("Güncelleme için gerekli alanları doldur.");
    }

    $yeniGorselYolu = guvenliDosyaYukle('yeni_gorsel');

    if ($yeniGorselYolu) {
        if (!empty($mevcutGorsel)) {
            $eskiDosyaYolu = "../" . $mevcutGorsel;
            if (file_exists($eskiDosyaYolu)) {
                unlink($eskiDosyaYolu);
            }
        }

        $guncelle = $db->prepare("UPDATE prompts SET baslik = ?, kategori = ?, prompt_metni = ?, yeni_gorsel = ? WHERE id = ?");
        $guncelle->execute([$baslik, $kategori, $prompt_metni, $yeniGorselYolu, $id]);
    } else {
        $guncelle = $db->prepare("UPDATE prompts SET baslik = ?, kategori = ?, prompt_metni = ? WHERE id = ?");
        $guncelle->execute([$baslik, $kategori, $prompt_metni, $id]);
    }

    geriDon("Prompt başarıyla güncellendi.", "../admin.php");
}

/* ---------------- ADMIN PROMPT SİL ---------------- */
if (isset($_GET['prompt_sil'])) {
    if (!adminMi()) {
        geriDon("Yetkisiz erişim.");
    }

    $id = (int)$_GET['prompt_sil'];

    $cek = $db->prepare("SELECT yeni_gorsel FROM prompts WHERE id = ?");
    $cek->execute([$id]);
    $prompt = $cek->fetch(PDO::FETCH_ASSOC);

    if (!$prompt) {
        geriDon("Silinecek kayıt bulunamadı.", "../admin.php");
    }

    $sil = $db->prepare("DELETE FROM prompts WHERE id = ?");
    $sil->execute([$id]);

    if (!empty($prompt['yeni_gorsel'])) {
        $dosyaYolu = "../" . $prompt['yeni_gorsel'];
        if (file_exists($dosyaYolu)) {
            unlink($dosyaYolu);
        }
    }

    geriDon("Prompt silindi.", "../admin.php");
}

/* ---------------- SOSYAL GÖNDERİ EKLE ---------------- */
if (isset($_POST['gonderi_paylas'])) {
    if (!isset($_SESSION['kullanici_id'])) {
        header("Location: ../pages/sosyal.php?durum=giris_gerekli");
        exit();
    }

    $icerik = trim($_POST['post_content'] ?? '');
    $tur = trim($_POST['post_type'] ?? 'genel');

    if ($icerik === '') {
        header("Location: ../pages/sosyal.php?durum=bos_gonderi");
        exit();
    }

    if (!in_array($tur, ['genel', 'prompt'])) {
        $tur = 'genel';
    }

    $sorgu = $db->prepare("
        INSERT INTO sosyal_gonderiler (kullanici_id, gonderi_turu, icerik, olusturma_tarihi)
        VALUES (?, ?, ?, NOW())
    ");
    $sorgu->execute([$_SESSION['kullanici_id'], $tur, $icerik]);

    header("Location: ../pages/sosyal.php?durum=gonderi_paylasildi");
    exit();
}

/* ---------------- ADMIN SOSYAL GÖNDERİ SİL ---------------- */
if (isset($_GET['sosyal_sil'])) {
    if (!adminMi()) {
        header("Location: ../pages/sosyal.php?durum=yetkisiz");
        exit();
    }

    $id = (int)$_GET['sosyal_sil'];

    if ($id <= 0) {
        header("Location: ../pages/sosyal.php?durum=gecersiz");
        exit();
    }

    $sil = $db->prepare("DELETE FROM sosyal_gonderiler WHERE id = ?");
    $sil->execute([$id]);

    header("Location: ../pages/sosyal.php?durum=gonderi_silindi");
    exit();
}

/* ---------------- İLETİŞİM FORMU ---------------- */
if (isset($_POST['iletisim_gonder'])) {
    $ad_soyad = trim($_POST['ad_soyad'] ?? '');
    $eposta = trim($_POST['eposta'] ?? '');
    $konu = trim($_POST['konu'] ?? '');
    $mesaj = trim($_POST['mesaj'] ?? '');

    if ($ad_soyad === '' || $eposta === '' || $konu === '' || $mesaj === '') {
        header("Location: ../index.php?iletisim=hata#iletisim");
        exit();
    }

    if (!filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
        header("Location: ../index.php?iletisim=hata#iletisim");
        exit();
    }

    $sorgu = $db->prepare("
        INSERT INTO iletisim_mesajlari (ad_soyad, eposta, konu, mesaj)
        VALUES (?, ?, ?, ?)
    ");

    $sorgu->execute([$ad_soyad, $eposta, $konu, $mesaj]);

    header("Location: ../index.php?iletisim=basarili#iletisim");
    exit();
}

geriDon("Geçersiz işlem.");
?>