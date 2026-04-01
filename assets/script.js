function resimDegistir() {
    const resim1 = document.getElementById('anaresim');
    const resim2 = document.getElementById('ikinciresim');

    // Eğer birinci resim görünürse (active sınıfı varsa)
    if (resim1.classList.contains('active')) {
        resim1.classList.remove('active'); // 1. resmi gizle (CSS opacity 0 yapar)
        resim2.classList.add('active');    // 2. resmi göster (CSS opacity 1 yapar)
    } else {
        // Tam tersi: İkinci resim görünürse
        resim2.classList.remove('active'); // 2. resmi gizle
        resim1.classList.add('active');    // 1. resmi göster
    }
}
