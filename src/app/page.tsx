import Link from "next/link";
import "./_landing/landing.css";
import {
  Sprig,
  Divider,
  IconCheck,
  IconArrow,
  FeatureIcon,
} from "./_landing/ornaments";

const FEATURES = [
  {
    icon: "rsvp" as const,
    title: "RSVP tanpa ribet",
    body: "Tamu konfirmasi kehadiran langsung dari undangan. Rekapnya masuk ke dashboard secara real-time.",
  },
  {
    icon: "guestbook" as const,
    title: "Buku tamu & ucapan",
    body: "Kumpulkan doa dan ucapan hangat di satu tempat. Moderasi sebelum tayang, kapan saja.",
  },
  {
    icon: "gallery" as const,
    title: "Galeri & love story",
    body: "Ceritakan perjalanan kalian lewat foto dan lini masa yang tersusun rapi.",
  },
  {
    icon: "gift" as const,
    title: "Amplop digital",
    body: "Terima hadiah lewat transfer bank & QRIS, langsung dari halaman undangan.",
  },
  {
    icon: "map" as const,
    title: "Lokasi & jadwal",
    body: "Peta, agenda akad & resepsi, dan simpan-ke-kalender hanya dengan satu ketukan.",
  },
  {
    icon: "music" as const,
    title: "Musik & keseruan",
    body: "Latar musik, tebak-tebakan, dan permainan kecil yang bikin tamu ikut merayakan.",
  },
];

const PALETTES = [
  { id: "sage", label: "Sage", colors: ["#8a9a86", "#efe9dc", "#c8b27a"] },
  { id: "rose", label: "Rose", colors: ["#cf9a97", "#f2e7e3", "#c8b27a"] },
  { id: "terracotta", label: "Terracotta", colors: ["#c07d57", "#f0e5da", "#b7975c"] },
  { id: "dusk", label: "Dusk", colors: ["#8c8aa6", "#e9e7ee", "#b7975c"] },
  { id: "crimson", label: "Crimson", colors: ["#a2454f", "#eee0dd", "#c8b27a"] },
];

const STEPS = [
  {
    num: "01",
    title: "Pilih desain",
    body: "Mulai dari template siap pakai, lalu sesuaikan warna dan tipografi hingga terasa milik kalian.",
  },
  {
    num: "02",
    title: "Isi cerita kalian",
    body: "Tambahkan nama, tanggal, susunan acara, foto, dan daftar tamu. Semua lewat satu editor.",
  },
  {
    num: "03",
    title: "Bagikan tautannya",
    body: "Kirim satu tautan personal ke tiap tamu. Undangan langsung tayang, tanpa aplikasi.",
  },
];

export default function HomePage() {
  return (
    <div className="ds-dos lp">
      {/* ---- nav ---- */}
      <header className="lp-nav">
        <div className="lp-shell lp-nav__row">
          <span className="lp-brand">
            <Sprig size={26} className="lp-brand__mark" />
            Invitatio
          </span>
          <nav className="lp-nav__links" aria-label="Utama">
            <a href="#fitur">Fitur</a>
            <a href="#template">Template</a>
            <a href="#vendor">Untuk vendor</a>
            <a href="#cara">Cara kerja</a>
          </nav>
          <div className="lp-nav__cta">
            <Link href="/dashboard" className="lp-nav__signin">
              Masuk
            </Link>
            <Link href="/inka-riyadi" className="lp-btn lp-btn--small">
              Lihat contoh
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ---- hero ---- */}
        <section className="lp-hero">
          <div className="lp-shell lp-hero__grid">
            <div className="lp-hero__copy">
              <span className="lp-eyebrow">Undangan pernikahan digital</span>
              <h1 className="lp-hero__title">
                Rayakan hari bahagia,
                <span className="lp-hero__flourish">lewat satu tautan.</span>
              </h1>
              <p className="lp-hero__lede">
                Undangan digital yang seindah harinya — lengkap dengan RSVP, buku
                tamu, galeri, dan amplop digital. Dibuat personal untuk setiap
                tamu yang kalian undang.
              </p>
              <div className="lp-hero__actions">
                <Link href="/dashboard" className="lp-btn">
                  Buat undangan <IconArrow />
                </Link>
                <Link href="/inka-riyadi" className="lp-btn lp-btn--ghost">
                  Lihat contoh undangan
                </Link>
              </div>
              <div className="lp-hero__meta">
                <span>
                  <IconCheck /> Tanpa aplikasi, buka di mana saja
                </span>
                <span>
                  <IconCheck /> Siap dalam hitungan menit
                </span>
                <span>
                  <IconCheck /> Personal untuk tiap tamu
                </span>
              </div>
            </div>

            {/* signature: the living invitation */}
            <div className="lp-stage">
              <div className="lp-stage__halo" />
              <Sprig size={128} className="lp-sprig lp-sprig--tl" />
              <Sprig size={144} className="lp-sprig lp-sprig--br" />
              <Sprig size={88} className="lp-sprig lp-sprig--tr" />

              <div className="lp-phone">
                <span className="lp-phone__notch" />
                <div className="lp-phone__screen">
                  <span className="lp-card__frame" />
                  <span className="lp-card__eyebrow">The Wedding Of</span>
                  <Sprig size={30} className="lp-card__sprig" />
                  <p className="lp-card__names">
                    Inka
                    <span className="lp-card__amp">&amp;</span>
                    Riyadi
                  </p>
                  <p className="lp-card__date">Sabtu, 12 Oktober 2026</p>
                  <span className="lp-card__rule" />
                  <span className="lp-card__pill">Buka Undangan</span>
                </div>
              </div>

              <div className="lp-chip lp-chip--rsvp">
                <span className="lp-chip__dot">
                  <IconCheck size={13} />
                </span>
                <span>
                  <strong>+3</strong> tamu hadir
                </span>
              </div>
              <div className="lp-chip lp-chip--guest">
                <span className="lp-chip__dot">
                  <Sprig size={13} />
                </span>
                <span>
                  Untuk <strong>Kel. Wijaya</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ---- features ---- */}
        <section className="lp-section" id="fitur">
          <div className="lp-shell">
            <div className="lp-head">
              <span className="lp-eyebrow">Semua dalam satu halaman</span>
              <h2 className="lp-h2" style={{ marginTop: "1rem" }}>
                Setiap detail hari bahagia, tertata rapi
              </h2>
              <p className="lp-head__lede">
                Bukan sekadar undangan yang cantik. Invitatio mengurus konfirmasi
                tamu, ucapan, hadiah, hingga arah ke lokasi — jadi kalian tinggal
                menikmati harinya.
              </p>
            </div>

            <div className="lp-features">
              {FEATURES.map((f) => (
                <article className="lp-feature lp-reveal" key={f.title}>
                  <div className="lp-feature__icon">
                    <FeatureIcon name={f.icon} />
                  </div>
                  <h3 className="lp-feature__title">{f.title}</h3>
                  <p className="lp-feature__body">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- personalized links ---- */}
        <section className="lp-section lp-section--well">
          <div className="lp-shell">
            <div className="lp-personal lp-reveal">
              <div>
                <span className="lp-eyebrow">Sentuhan personal</span>
                <h2 className="lp-h2" style={{ marginTop: "1rem" }}>
                  Setiap tamu, disapa namanya
                </h2>
                <p className="lp-head__lede" style={{ maxWidth: "42ch" }}>
                  Buat tautan unik untuk tiap tamu. Undangan menyambut mereka
                  dengan nama, dan formulir RSVP-nya sudah terisi — tak ada lagi
                  salah kirim atau salah nama.
                </p>
                <ul className="lp-personal__list">
                  <li>
                    <IconCheck />
                    Impor daftar tamu sekali lewat CSV.
                  </li>
                  <li>
                    <IconCheck />
                    Tautan personal dibuat otomatis untuk semua orang.
                  </li>
                  <li>
                    <IconCheck />
                    Lacak siapa yang sudah membuka dan mengonfirmasi.
                  </li>
                </ul>
              </div>
              <div className="lp-links" aria-hidden="true">
                <div className="lp-link-row">
                  <span className="lp-link-row__avatar">W</span>
                  <span className="lp-link-row__meta">
                    <span className="lp-link-row__name">Kel. Wijaya</span>
                    <span className="lp-link-row__url">
                      invitatio.app/inka-riyadi?to=<b>w8kq2</b>
                    </span>
                  </span>
                </div>
                <div className="lp-link-row">
                  <span className="lp-link-row__avatar">S</span>
                  <span className="lp-link-row__meta">
                    <span className="lp-link-row__name">Bapak Surya</span>
                    <span className="lp-link-row__url">
                      invitatio.app/inka-riyadi?to=<b>3pr-x</b>
                    </span>
                  </span>
                </div>
                <div className="lp-link-row">
                  <span className="lp-link-row__avatar">N</span>
                  <span className="lp-link-row__meta">
                    <span className="lp-link-row__name">Nadia &amp; Rekan</span>
                    <span className="lp-link-row__url">
                      invitatio.app/inka-riyadi?to=<b>hzt9m</b>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- palettes / variety ---- */}
        <section className="lp-section" id="template">
          <div className="lp-shell">
            <div className="lp-head lp-head--center">
              <span className="lp-eyebrow lp-eyebrow--center">
                Satu undangan, banyak nuansa
              </span>
              <h2 className="lp-h2" style={{ marginTop: "1rem" }}>
                Warna dan tipografi yang terasa milik kalian
              </h2>
              <p className="lp-head__lede">
                Lima palet warna hangat dan empat set tipografi. Padukan sesuai
                tema pernikahan — dari yang klasik teduh hingga modern berani.
              </p>
            </div>

            <div className="lp-palettes">
              {PALETTES.map((p) => (
                <div className="lp-swatch lp-reveal" key={p.id}>
                  <div className="lp-swatch__band">
                    {p.colors.map((c) => (
                      <span key={c} style={{ background: c }} />
                    ))}
                  </div>
                  <div className="lp-swatch__label">{p.label}</div>
                </div>
              ))}
            </div>

            <div className="lp-types">
              <span className="lp-type-chip">
                <b>Classic</b> · Cormorant Garamond
              </span>
              <span className="lp-type-chip">
                <b>Modern</b> · Playfair Display
              </span>
              <span className="lp-type-chip">
                <b>Romantic</b> · EB Garamond
              </span>
              <span className="lp-type-chip">
                <b>Editorial</b> · Fraunces
              </span>
            </div>
          </div>
        </section>

        {/* ---- how it works ---- */}
        <section className="lp-section lp-section--well" id="cara">
          <div className="lp-shell">
            <div className="lp-head">
              <span className="lp-eyebrow">Cara kerja</span>
              <h2 className="lp-h2" style={{ marginTop: "1rem" }}>
                Dari kosong ke tayang, dalam tiga langkah
              </h2>
            </div>
            <div className="lp-steps">
              {STEPS.map((s) => (
                <div className="lp-step lp-reveal" key={s.num}>
                  <span className="lp-step__num">{s.num}</span>
                  <h3 className="lp-step__title">{s.title}</h3>
                  <p className="lp-step__body">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- vendor ---- */}
        <section className="lp-section" id="vendor">
          <div className="lp-shell">
            <div className="lp-vendor lp-reveal">
              <div>
                <span className="lp-eyebrow lp-vendor__eyebrow">
                  Untuk vendor & reseller
                </span>
                <h2 className="lp-vendor__title">
                  Bangun bisnis undangan digitalmu
                </h2>
                <p className="lp-vendor__body">
                  Kelola banyak klien dari satu dashboard. Susun undangan tanpa
                  ngoding, atur daftar tamu, dan pantau RSVP tiap acara. Kamu
                  fokus melayani pasangan — urusan teknis biar kami yang tangani.
                </p>
                <div className="lp-vendor__actions">
                  <Link href="/dashboard" className="lp-btn">
                    Mulai sebagai vendor <IconArrow />
                  </Link>
                  <a href="#cara" className="lp-btn lp-btn--ghost">
                    Lihat cara kerja
                  </a>
                </div>
              </div>
              <div className="lp-vendor__stats">
                <div>
                  <div className="lp-stat__num">Tanpa kode</div>
                  <div className="lp-stat__label">
                    Susun undangan lewat editor, bukan editor teks
                  </div>
                </div>
                <div>
                  <div className="lp-stat__num">Multi-klien</div>
                  <div className="lp-stat__label">
                    Semua acara dan daftar tamu di satu tempat
                  </div>
                </div>
                <div>
                  <div className="lp-stat__num">Siap jual</div>
                  <div className="lp-stat__label">
                    Terbitkan di alamat unik tiap pasangan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- closing cta ---- */}
        <section className="lp-cta">
          <div className="lp-shell">
            <Sprig size={44} style={{ color: "var(--gold-deep)", opacity: 0.85 }} />
            <p className="lp-script lp-cta__script">Mari mulai</p>
            <h2 className="lp-cta__title">Undangan indah kalian menanti</h2>
            <div className="lp-cta__actions">
              <Link href="/dashboard" className="lp-btn">
                Buat undangan sekarang <IconArrow />
              </Link>
              <Link href="/inka-riyadi" className="lp-btn lp-btn--ghost">
                Lihat contoh
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ---- footer ---- */}
      <footer className="lp-footer">
        <div className="lp-shell">
          <div className="lp-footer__row">
            <span className="lp-brand">
              <Sprig size={22} className="lp-brand__mark" />
              Invitatio
            </span>
            <nav className="lp-footer__links" aria-label="Footer">
              <a href="#fitur">Fitur</a>
              <a href="#template">Template</a>
              <a href="#vendor">Untuk vendor</a>
              <Link href="/dashboard">Masuk</Link>
            </nav>
          </div>
          <p className="lp-footer__legal">
            © {new Date().getFullYear()} Invitatio · Undangan pernikahan digital,
            dibuat personal untuk hari bahagia.
          </p>
        </div>
      </footer>
    </div>
  );
}
