# PROMPTLA Firebase Geçiş Planı

Bu sürüm statik HTML/CSS/JS olarak çalışır. Veritabanı, üyelik ve admin işlemleri bilinçli olarak aktif değildir. Domain ve hosting hazır olduktan sonra Firebase entegrasyonu aşağıdaki sırayla yapılmalıdır.

## 1. Firebase Authentication

Önce kullanıcı sistemi bağlanmalı:

- E-posta / şifre ile kayıt
- E-posta / şifre ile giriş
- Oturum durumunu header ve profil sayfasına yansıtma
- Çıkış yapma
- Yetkili admin kullanıcısı kontrolü

## 2. Firestore koleksiyonları

Önerilen başlangıç koleksiyonları:

```text
users/{uid}
prompts/{promptId}
comments/{commentId}
socialPosts/{postId}
savedPrompts/{uid_promptId}
gameScores/{scoreId}
```

## 3. Oyun skorları

Yeni oyunlar localStorage ile rekor tutar. Firebase sonrası:

- Kullanıcı giriş yaptıysa skor Firestore'a yazılır.
- Giriş yoksa localStorage kullanılmaya devam eder.
- Her oyun için haftalık ve tüm zamanlar skor tablosu eklenebilir.

## 4. Admin panel

Canlı yayında `admin.html` herkese açık bırakılmamalıdır. Firebase sonrası admin paneli:

- Sadece admin rolüne sahip kullanıcıya görünmeli
- Prompt ekleme / düzenleme / silme yapabilmeli
- Sosyal gönderi ve yorum moderasyonu içermeli
- Oyun skorlarını sıfırlama veya gizleme yetkisi sunmalı

## 5. Storage

Profil fotoğrafı ve sosyal gönderi görselleri için Firebase Storage kullanılmalı. Base64 görsellerin localStorage içinde tutulması canlı sürüm için önerilmez.

## 6. Yayın sırası

1. Statik siteyi domain/hostinge yükle
2. Gerçek domaini sitemap.xml içinde değiştir
3. Firebase projesi oluştur
4. Authentication aktif et
5. Firestore güvenlik kurallarını yaz
6. Login/register sayfalarını Firebase'e bağla
7. Profil, yorum, sosyal gönderi ve skor sistemlerini sırayla taşı
