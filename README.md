# PROMPTLA HTML Yayın Paketi

Bu paket PROMPTLA web sitesinin PHP ve veritabanı bağımlılığı kaldırılmış, HTML/CSS/JavaScript yapısına dönüştürülmüş yayın hazır ön yüz sürümüdür.

## İçerik

- `index.html`: ana sayfa
- `pages/`: model rehberi, promptlar, sosyal akış, profil ve giriş/kayıt sayfaları
- `assets/style.css`: mevcut tasarım ve animasyonlar
- `assets/script.js`: menü, slider, kopyalama, sosyal paylaşım, fotoğraf önizleme ve form etkileşimleri
- `images/`: proje görselleri
- `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`: yayın yardımcı dosyaları

## Yayınlama

Dosyaları hosting veya GitHub Pages deposunun kök dizinine yükle. Ana giriş dosyası `index.html` dosyasıdır. InfinityFree üzerinde eski sunucu dosyaları kalırsa temiz bir geçiş için ana dizini yedekleyip bu paketin içeriğini köke yüklemen önerilir.

## Not

Bu sürüm yalnızca HTML/CSS/JavaScript ile çalışır. Sunucu taraflı üyelik, veritabanı ve dosya yükleme gibi işlemler için ayrıca backend entegrasyonu gerekir. Görsel tasarım, animasyonlar ve mevcut sayfa akışları korunmuştur.


## Oyun modülü
Bu sürümde 4 oynanabilir HTML Canvas oyunu vardır: Yılan, Pacman tarzı labirent, 2D hava hokeyi ve futbol penaltı. Prompt kütüphanesine oyun promptları ve kategori penceresi eklenmiştir.

## Firebase geçişi
Statik oturum ve yorum sistemi localStorage ile çalışır. Firebase Authentication ve Firestore entegrasyonu için veri modeli hazır tutulmuştur.


## Son düzenleme
- Yapay zeka araç bağlantıları resmi site yönlendirmeleriyle güncellendi.
- Kişisel değerlendirme alanları model sayfalarından kaldırıldı.
- `pages/ai-arastirma.html` araştırma ve uzun metin alanı olarak eklendi.
- Ana sayfadaki Meshy AI kartı kaldırılarak daha fazlasını gör butonu eklendi.

## 25.05.2026 AI araştırma sayfası düzeltmesi
- `pages/ai-arastirma.html` içindeki kullanıcı yazı alanı kaldırıldı.
- Sayfa, kod içinden düzenlenebilecek ve ziyaretçiler tarafından sadece okunacak makale düzenine çevrildi.
- Metin ekleme yerleri HTML yorumlarıyla işaretlendi.

## 25.05.2026 Oyun modülü genişletmesi
- `games/endless-drive.html` eklendi: çöl atmosferli, 3D hissi veren sonsuz araba sürüş oyunu.
- `games/aim-reflex.html` eklendi: Aim Lab tarzı profesyonel refleks/nişan oyunu.
- `games/space-dodge.html` eklendi: asteroit kaçış oyunu.
- `games/neon-tunnel.html` eklendi: neon tünel refleks oyunu.
- Yeni oyunlar `assets/arcade3d.css` ve `assets/arcade3d.js` üzerinden çalışır.
- Yeni oyunlarda tam ekran, mobil yatay kullanım denemesi, WASD/ok tuşları, dokunmatik kontroller ve localStorage rekor sistemi vardır.
- Eski Canvas oyunlarına da tam ekran butonu eklendi.
- Mobil Promptlar dropdown çakışması giderildi.
- Firebase geçişi için `docs/firebase-gecis-plani.md` dosyası eklendi.

> Not: `sitemap.xml` içinde geçici alan adı olarak `https://promptla.example/` kullanılmıştır. Gerçek domain alındığında tüm `loc` değerleri gerçek domainle değiştirilmelidir.
- Görsellerdeki birebir tekrarlar temizlendi ve kalan görseller WebP formatına dönüştürüldü. Bu işlem paket boyutunu ciddi şekilde düşürür ve mobil açılışı hızlandırır.
- Promptlar sayfasına yeni 3D oyun üretim promptları eklendi: Pixel Dino Runner, Reflex Aim Arena, Uzay Kaçış Rotası ve Neon Tünel Geçişi.
