<?php
session_start();
require_once 'baglanti.php'; // Aynı klasörde oldukları için direkt yazdık

// --- KAYIT OL İŞLEMİ ---
if (isset($_POST['kayit_ol'])) {
    $ad_soyad = trim($_POST['registerName']);
    $eposta = trim($_POST['registerEmail']);
    $sifre = $_POST['registerPassword'];

    $hashli_sifre = password_hash($sifre, PASSWORD_DEFAULT); 

    try {
        $sorgu = $db->prepare("INSERT INTO kullanicilar (ad_soyad, eposta, sifre) VALUES (?, ?, ?)");
        $sorgu->execute([$ad_soyad, $eposta, $hashli_sifre]);
        
        // assets dışına çıkıp pages içindeki sosyal.html'e gider
        echo "<script>alert('Kayıt başarılı!'); window.location.href='../pages/sosyal.html';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('Bu e-posta zaten kullanılıyor.'); window.history.back();</script>";
    }
}

// --- GİRİŞ YAP İŞLEMİ ---
if (isset($_POST['giris_yap'])) {
    $eposta = trim($_POST['loginEmail']);
    $sifre = $_POST['loginPassword'];

    $sorgu = $db->prepare("SELECT * FROM kullanicilar WHERE eposta = ?");
    $sorgu->execute([$eposta]);
    $kullanici = $sorgu->fetch(PDO::FETCH_ASSOC);

    if ($kullanici && password_verify($sifre, $kullanici['sifre'])) {
        $_SESSION['kullanici_id'] = $kullanici['id'];
        $_SESSION['kullanici_adi'] = $kullanici['ad_soyad'];
        
        // PHP, tarayıcının hafızasına 'phpUser' adında bir not bırakıyor
        echo "<script>
            localStorage.setItem('phpUser', '" . $kullanici['ad_soyad'] . "');
            alert('Hoşgeldin, " . $kullanici['ad_soyad'] . "!'); 
            window.location.href='../index.html';
        </script>";
    } else {
        echo "<script>alert('Hatalı giriş!'); window.history.back();</script>";
    }
}
?>
