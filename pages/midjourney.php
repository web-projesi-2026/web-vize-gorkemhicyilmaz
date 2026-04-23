<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Midjourney v6 - PROMPTLA</title>
    <link rel="stylesheet" href="../assets/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="logo">prompt<span>la</span></div>
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
                    <button class="account-btn" onclick="toggleDropdown(event)">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Hesap
                    </button>
                    <div class="account-dropdown" id="accountDropdown">
                        <a href="javascript:void(0)" onclick="openAuthModal('login')">Giriş Yap</a>
                        <a href="javascript:void(0)" onclick="openAuthModal('register')">Kayıt Ol</a>
                    </div>
                </li>
            </ul>
        </nav>
    </header>

    <section class="detail-section">
        <div class="detail-header">
            <h1>Midjourney v6</h1>
            <p>Metin tabanlı komutlarla sanatsal ve hiper-gerçekçi görseller üreten öncü yapay zeka görsel oluşturma aracı.</p>
        </div>

        <div class="detail-content">
            <div class="detail-card">
                <h3>Genel Bakış</h3>
                <p>Midjourney, metin açıklamalarından (prompt) yüksek kaliteli, sanatsal görseller üreten bir yapay zeka aracıdır. V6 sürümü, önceki versiyonlara göre önemli iyileştirmeler sunar: daha gerçekçi ışık ve gölge, daha iyi metin anlama, gelişmiş insan figürleri ve çoklu stil desteği. Discord platformu üzerinden çalışır ve güçlü bir topluluk desteğine sahiptir.</p>
            </div>
            <div class="detail-card">
                <h3>Temel Özellikler</h3>
                <ul>
                    <li>Gelişmiş görsel kalitesi ve fotogerçekçilik</li>
                    <li>Karmaşık ve uzun promptları anlama</li>
                    <li>Çoklu sanat stili birleştirme</li>
                    <li>İyileştirilmiş insan figürleri ve anatomi</li>
                    <li>Metin içeren görseller oluşturma</li>
                    <li>Görsel varyasyon ve düzenleme</li>
                    <li>Yüksek çözünürlüklü çıktılar</li>
                    <li>Discord entegrasyonu ve topluluk</li>
                </ul>
            </div>
            <div class="detail-card">
                <h3>Kullanım Alanları</h3>
                <p><strong>Konsept Sanatı:</strong> Oyun, film ve animasyon için karakter ve ortam tasarımı.</p>
                <p><strong>İllüstrasyon:</strong> Kitap kapakları, dergi illüstrasyonları ve dijital sanat.</p>
                <p><strong>Reklam ve Pazarlama:</strong> Ürün görselleri, kampanya materyalleri ve marka varlıkları.</p>
                <p><strong>Mimari ve İç Mekan:</strong> Bina tasarımları ve iç mekan görselleştirmesi.</p>
            </div>
            <div class="detail-card">
                <h3>Fiyatlandırma</h3>
                <ul>
                    <li><strong>Temel Plan (10$/ay):</strong> Aylık 200 GPU dakikası, sınırlı hız</li>
                    <li><strong>Standart Plan (30$/ay):</strong> Aylık 15 GPU saati, sınırsız relax modu</li>
                    <li><strong>Pro Plan (60$/ay):</strong> Aylık 30 GPU saati, gizli mod, daha hızlı üretim</li>
                    <li><strong>Mega Plan (120$/ay):</strong> Aylık 60 GPU saati, en yüksek hız ve öncelik</li>
                </ul>
            </div>
            <div class="detail-card" style="grid-column: 1 / -1;">
                <h3>Avantajlar ve Dezavantajlar</h3>
                <p><strong>Avantajlar:</strong> Sanatsal kalite, yaratıcı stil çeşitliliği, güçlü topluluk, hızlı iterasyon.</p>
                <p><strong>Dezavantajlar:</strong> Discord zorunluluğu, öğrenme eğrisi, telif ve etik tartışmalar, kontrol sınırlamaları.</p>
            </div>
        </div>
        <a href="../index.php" class="back-btn">← Ana Sayfaya Dön</a>
    </section>

    <footer id="contact">
        <div class="footer-about">
            <h3 style="color: var(--accent); margin-bottom: 15px; font-size: 1.2rem;">PROMPTLA Hakkında</h3>
            <p>Bu web platformu <strong>Görkem Hiçyılmaz</strong> tarafından tasarlanmıştır. Geliştirme sürecinde <strong>ChatGPT</strong>, <strong>Kimi AI</strong> ve <strong>Google Gemini</strong> profesyonel asistanlar olarak kullanılmıştır.</p>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 PROMPTLA. Tüm Hakları Saklıdır.</p>
            <div class="socials">
                <span>Instagram</span> • <span>X (Twitter)</span> • <span>LinkedIn</span>
            </div>
        </div>
    </footer>

    <div id="authModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeAuthModal()">&times;</span>
            <div class="auth-tabs">
                <button class="tab-btn active" id="tab-login" onclick="switchAuthTab('login')">Giriş Yap</button>
                <button class="tab-btn" id="tab-register" onclick="switchAuthTab('register')">Kayıt Ol</button>
            </div>
            
            <div id="loginForm" class="auth-form active">
                <button type="button" onclick="socialLogin('google')" class="social-btn">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G"> Google ile giriş yap
                </button>
                <button type="button" onclick="socialLogin('github')" class="social-btn">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GH" style="filter: invert(1);"> GitHub ile giriş yap
                </button>
                <div class="divider"><span>veya klasik giriş</span></div>
                <input type="email" placeholder="E-posta adresiniz" required>
                <input type="password" placeholder="Şifreniz" required>
                <button class="btn btn-full">Giriş Yap</button>
            </div>

            <div id="registerForm" class="auth-form">
                <button type="button" onclick="socialLogin('google')" class="social-btn">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G"> Google ile kayıt ol
                </button>
                <button type="button" onclick="socialLogin('github')" class="social-btn">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GH" style="filter: invert(1);"> GitHub ile kayıt ol
                </button>
                <div class="divider"><span>veya e-posta ile</span></div>
                <input type="text" placeholder="Adınız Soyadınız" required>
                <input type="email" placeholder="E-posta adresiniz" required>
                <input type="password" placeholder="Şifre belirleyin" required>
                <button class="btn btn-full">Kayıt Ol</button>
            </div>
        </div>
    </div>

    <script type="module" src="../assets/script.js"></script>
</body>
</html>