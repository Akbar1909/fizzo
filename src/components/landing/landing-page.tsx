import Link from "next/link";
import { env } from "@/lib/env";
import { getApprovedReviews } from "@/lib/reviews";
import styles from "./landing.module.css";

const SECTIONS = [
  {
    n: "1",
    iconBg: "#FBE3D2",
    iconColor: "#C2410C",
    title: "Mexanika",
    count: "13 savol",
    desc: "Kinematika, dinamika, statika, suyuqlik va gazlar mexanikasi, saqlanish qonunlari, tebranishlar va to'lqinlar",
    badge: "Hozir ochiq",
    badgeBg: "#D7EEDC",
    badgeColor: "#15803D",
  },
  {
    n: "2",
    iconBg: "#DCE6FB",
    iconColor: "#1D4ED8",
    title: "Elektr va magnitizm",
    count: "12 savol",
    desc: "Elektrostatika, o'zgarmas tok, turli muhitlarda tok, magnitizm, elektromagnit tebranishlar",
    badge: "Tez orada",
    badgeBg: "#F1ECE2",
    badgeColor: "#5B6470",
  },
  {
    n: "3",
    iconBg: "#D7EEDC",
    iconColor: "#15803D",
    title: "Molekulyar fizika va termodinamika",
    count: "7 savol",
    desc: "Molekulyar-kinetik nazariya, gaz qonunlari, termodinamika qonunlari, suyuqlik va qattiq jismlar",
    badge: "Tez orada",
    badgeBg: "#F1ECE2",
    badgeColor: "#5B6470",
  },
  {
    n: "4",
    iconBg: "#F3E8C9",
    iconColor: "#8A5A00",
    title: "Optika va nisbiylik nazariyasi",
    count: "5 savol",
    desc: "Geometrik optika, linzalar, to'lqin optikasi, maxsus nisbiylik nazariyasi asoslari",
    badge: "Tez orada",
    badgeBg: "#F1ECE2",
    badgeColor: "#5B6470",
  },
  {
    n: "5",
    iconBg: "#E9E3F5",
    iconColor: "#5B3FA8",
    title: "Kvant, atom va yadro fizikasi",
    count: "4 savol",
    desc: "Fotoeffekt, fotonlar, Bor modeli, radioaktiv yemirilish, yadro reaksiyalari",
    badge: "Tez orada",
    badgeBg: "#F1ECE2",
    badgeColor: "#5B6470",
  },
];

function buildFaq(botUsername: string) {
  return [
    {
      q: "Milliy sertifikat nima?",
      a: "Bilim va malakalarni baholash agentligi o'tkazadigan davlat imtihoni. Yetarli daraja olsangiz, oliy ta'limga qabulda shu fan bo'yicha imtiyozga ega bo'lasiz. Aniq qoidalarni uzbmb.uz saytida tekshiring.",
    },
    {
      q: "Fizika imtihoni qanday tuzilgan?",
      a: "45 topshiriq: 32 ta bitta javobli, 3 ta moslashtirish va 10 ta ochiq (a va b bandli) savol. Umumiy vaqt — 150 daqiqa. Natija Rasch modeli asosida hisoblanadi.",
    },
    {
      q: "Fizzo bepulmi?",
      a: "Ha, kunlik mashqlar va animatsiyali yechimlar bepul. Premium imkoniyatlari keyinroq e'lon qilinadi.",
    },
    {
      q: "Qaysi bo'limlar hozir ochiq?",
      a: "Hozir mexanika ochiq. Qolgan bo'limlar bosqichma-bosqich qo'shiladi.",
    },
    {
      q: "Savollar to'g'riligiga ishonsa bo'ladimi?",
      a: 'Har bir savol chiqarilishdan oldin qayta yechib tekshiriladi. Xato topsangiz, savol ostidagi "Xabar bering" tugmasini bosing.',
    },
    {
      q: "Ilova yuklab olish kerakmi?",
      a: `Yo'q. Fizzo Telegram ichida ochiladi, kompyuterda esa brauzerda ishlaydi. Telegram orqali kirasiz — parol kerak emas${botUsername ? ` (@${botUsername})` : ""}.`,
    },
  ];
}

function CheckIcon() {
  return (
    <span
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        background: "#D7EEDC",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M2 6.5l2.5 2.5L10 3" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function PlusIcon() {
  return (
    <svg className={styles.plus} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 4v12M4 10h12" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export async function LandingPage() {
  const faq = buildFaq(env.telegramBotUsername);
  const reviews = await getApprovedReviews();

  return (
    <div className={styles.root} style={{ fontFamily: "var(--font-ui)", color: "#1B2430", background: "#F6F1E7", minHeight: "100vh" }}>
      <header className={styles.wrap} style={{ paddingTop: 18, paddingBottom: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 32px" }}>
        <a href="#" aria-label="Fizzo bosh sahifa" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="16" fill="#1B2430" />
            <line x1="21" y1="13" x2="43" y2="13" stroke="#F6F3EC" strokeWidth="3.5" strokeLinecap="round" />
            <polyline
              points="32,13 32,17 25,18.7 39,22 25,25.3 39,28.7 25,32 39,35.3 32,37 32,41"
              fill="none"
              stroke="#F6F3EC"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="48.5" r="7.5" fill="#C2410C" />
          </svg>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em" }}>
            fizzo<span style={{ color: "#C2410C" }}>.</span>
          </span>
        </a>
        <nav aria-label="Asosiy" style={{ display: "flex", flexWrap: "wrap", gap: "6px 26px" }}>
          <a className={styles.navlink} href="#sertifikat">
            Milliy sertifikat
          </a>
          <a className={styles.navlink} href="#bolimlar">
            Bo&apos;limlar
          </a>
          <a className={styles.navlink} href="#imkoniyatlar">
            Imkoniyatlar
          </a>
          <a className={styles.navlink} href="#savollar">
            Savol-javob
          </a>
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <Link className={styles.navlink} href="/kirish" style={{ fontWeight: 600 }}>
            Kirish
          </Link>
          <Link className={styles.btn} href="/kirish" style={{ minHeight: 44, padding: "0 18px", fontSize: 15, borderRadius: 12 }}>
            Bepul boshlash
          </Link>
        </div>
      </header>

      <section className={styles.wrap} style={{ paddingTop: 40, paddingBottom: 72, display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center" }}>
        <div style={{ flex: "1 1 480px", minWidth: 0 }}>
          <span className={styles.kicker}>Milliy sertifikat · fizika</span>
          <h1 style={{ margin: "12px 0 0", fontWeight: 800, fontSize: "clamp(36px, 5vw, 58px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Fizikadan milliy sertifikatga o&apos;zbek tilida tayyorlaning
          </h1>
          <p style={{ margin: "18px 0 0", fontSize: 19, lineHeight: 1.6, color: "#4A5360", maxWidth: 540 }}>
            Rasmiy 5 bo&apos;lim bo&apos;yicha mashqlar, har bir yechim animatsiya bilan tushuntiriladi va kompyuterdagi
            imtihon formatida mock testlar bor. Kuniga 10 daqiqa, Telegram ichida.
          </p>
          <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link className={styles.btn} href="/kirish">
              Bepul boshlash
            </Link>
            <a className={styles.btn2} href="#bolimlar">
              Bo&apos;limlarni ko&apos;rish
            </a>
          </div>
          <ul style={{ margin: "30px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "10px 28px", fontSize: 15, fontWeight: 500, color: "#3A4552" }}>
            <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckIcon />
              Rasmiy 5 bo&apos;lim
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckIcon />
              45 savollik mock test
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckIcon />
              Bepul, o&apos;zbek tilida
            </li>
          </ul>
        </div>

        <figure style={{ flex: "1 1 440px", minWidth: 0, margin: 0 }}>
          <svg viewBox="0 0 480 420" width="100%" role="img" aria-label="Fizika rasmlari: mayatnik, qiya tekislik, atom va formulalar" style={{ display: "block" }}>
            <circle cx="250" cy="215" r="190" fill="#FBE3D2" />
            <circle cx="390" cy="92" r="46" fill="#DCE6FB" />
            <circle cx="92" cy="330" r="38" fill="#D7EEDC" />

            <g>
              <rect x="186" y="58" width="144" height="12" rx="6" fill="#1B2430" />
              <rect x="198" y="70" width="10" height="250" rx="5" fill="#1B2430" />
              <rect x="160" y="316" width="76" height="14" rx="7" fill="#1B2430" />
              <g className={styles.swing}>
                <line x1="258" y1="70" x2="258" y2="214" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
                <circle cx="258" cy="230" r="22" fill="#C2410C" />
                <circle cx="251" cy="223" r="6" fill="#F4A07A" />
              </g>
              <circle cx="258" cy="70" r="7" fill="#F6F1E7" stroke="#1B2430" strokeWidth="3" />
            </g>

            <g transform="translate(232 278)">
              <path d="M0 96 L196 96 L196 8 Z" fill="#FFFFFF" stroke="#1B2430" strokeWidth="3" strokeLinejoin="round" />
              <g transform="translate(118 46) rotate(-24.2)">
                <rect x="-24" y="-34" width="48" height="34" rx="6" fill="#1D4ED8" />
              </g>
              <path d="M40 96 A40 40 0 0 0 36.5 79.6" fill="none" stroke="#1B2430" strokeWidth="2" />
            </g>

            <g transform="translate(14 60)">
              <circle cx="96" cy="96" r="58" fill="#FFFFFF" stroke="#EAE3D5" strokeWidth="2" />
              <g className={styles.orbit}>
                <ellipse cx="96" cy="96" rx="52" ry="20" fill="none" stroke="#1B2430" strokeWidth="2.5" />
                <ellipse cx="96" cy="96" rx="52" ry="20" fill="none" stroke="#1B2430" strokeWidth="2.5" transform="rotate(60 96 96)" />
                <ellipse cx="96" cy="96" rx="52" ry="20" fill="none" stroke="#1B2430" strokeWidth="2.5" transform="rotate(120 96 96)" />
                <circle cx="148" cy="96" r="6" fill="#C2410C" />
              </g>
              <circle cx="96" cy="96" r="10" fill="#15803D" />
            </g>

            <g>
              <rect x="330" y="176" width="118" height="44" rx="12" fill="#FFFFFF" stroke="#EAE3D5" strokeWidth="2" />
              <text x="389" y="205" textAnchor="middle" fontFamily="STIX Two Text, serif" fontStyle="italic" fontSize="21" fill="#1B2430">
                F = ma
              </text>
              <rect x="40" y="240" width="128" height="44" rx="12" fill="#1B2430" />
              <text x="104" y="269" textAnchor="middle" fontFamily="STIX Two Text, serif" fontStyle="italic" fontSize="21" fill="#F6F1E7">
                E = mc²
              </text>
            </g>
          </svg>
        </figure>
      </section>

      <section id="sertifikat" style={{ background: "#FFFFFF", borderTop: "1px solid #EAE3D5", borderBottom: "1px solid #EAE3D5" }}>
        <div className={styles.wrap} style={{ paddingTop: 72, paddingBottom: 72 }}>
          <span className={styles.kicker}>Imtihon formati</span>
          <h2 className={styles.h2} style={{ marginTop: 8 }}>
            Milliy sertifikat imtihoni kabi mashq qiling
          </h2>
          <p className={styles.lead}>
            Fizika imtihoni endi kompyuterda topshiriladi. Fizzo&apos;dagi mock test rasmiy test varianti tuzilmasini
            takrorlaydi — imtihon kuni hech narsa yangilik bo&apos;lmaydi.
          </p>

          <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className={styles.card} style={{ padding: 22, background: "#FBF8F2" }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>32</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>Yopiq savol (Y-1)</div>
              <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: "#5B6470" }}>To&apos;rtta variantdan bitta to&apos;g&apos;ri javob.</div>
            </div>
            <div className={styles.card} style={{ padding: 22, background: "#FBF8F2" }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>3</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>Moslashtirish (Y-2)</div>
              <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: "#5B6470" }}>Ikki ustundagi tushunchalarni juftlash.</div>
            </div>
            <div className={styles.card} style={{ padding: 22, background: "#FBF8F2" }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>10</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>Ochiq savol (O)</div>
              <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: "#5B6470" }}>Javobni o&apos;zingiz yozasiz, a va b bandlari bilan.</div>
            </div>
            <div className={styles.card} style={{ padding: 22, background: "#1B2430", borderColor: "#1B2430", color: "#F6F1E7" }}>
              <div style={{ fontSize: 36, fontWeight: 800 }}>150</div>
              <div style={{ marginTop: 6, fontWeight: 700 }}>daqiqa</div>
              <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: "#C9CFD8" }}>Mock testda ham taymer xuddi shunday.</div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div className={styles.card} style={{ flex: "1 1 320px", padding: 22, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: "#DCE6FB", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="#1D4ED8" strokeWidth="2" />
                  <path d="M8 20h8M12 16v4" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: 700 }}>Kompyuterda topshiriladi</div>
                <div style={{ marginTop: 4, fontSize: 15, lineHeight: 1.55, color: "#5B6470" }}>
                  Bilim va malakalarni baholash agentligi fizika imtihonini elektron shaklda o&apos;tkazmoqda. Mock test ekrani shunga moslangan.
                </div>
              </div>
            </div>
            <div className={styles.card} style={{ flex: "1 1 320px", padding: 22, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: "#FBE3D2", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="#C2410C" strokeWidth="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <div style={{ fontWeight: 700 }}>Yiliga ikki marta</div>
                <div style={{ marginTop: 4, fontSize: 15, lineHeight: 1.55, color: "#5B6470" }}>
                  Fizikadan sertifikat imtihoni yil davomida ikki marta o&apos;tkaziladi. Aniq sanalarni uzbmb.uz saytida tekshiring.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="bolimlar" className={styles.wrap} style={{ paddingTop: 72, paddingBottom: 72 }}>
        <span className={styles.kicker}>Dastur</span>
        <h2 className={styles.h2} style={{ marginTop: 8 }}>
          Rasmiy spetsifikatsiyadagi 5 bo&apos;lim
        </h2>
        <p className={styles.lead}>Mavzular va savollar soni rasmiy test varianti tafsilotiga mos keladi.</p>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {SECTIONS.map((s) => (
            <div key={s.n} className={styles.card} style={{ padding: 22, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span
                style={{
                  flex: "none",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: s.iconBg,
                  color: s.iconColor,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                {s.n}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{s.title}</span>
                  <span style={{ flex: "none", fontSize: 13, fontWeight: 600, color: "#5B6470" }}>{s.count}</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.55, color: "#5B6470" }}>{s.desc}</div>
                <div
                  style={{
                    marginTop: 12,
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: s.badgeBg,
                    color: s.badgeColor,
                  }}
                >
                  {s.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="imkoniyatlar" style={{ background: "#FFFFFF", borderTop: "1px solid #EAE3D5", borderBottom: "1px solid #EAE3D5" }}>
        <div className={styles.wrap} style={{ paddingTop: 72, paddingBottom: 72 }}>
          <span className={styles.kicker}>Imkoniyatlar</span>
          <h2 className={styles.h2} style={{ marginTop: 8 }}>
            Nega Fizzo bilan tayyorlanish kerak?
          </h2>
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            <div className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: "#FBE3D2", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4l13 8-13 8z" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Animatsiyali yechimlar</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
                Kuchlar, harakat va grafiklar bosqichma-bosqich ko&apos;rsatiladi. Formulani yodlash emas — ko&apos;rib tushunish.
              </div>
            </div>

            <div className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: "#DCE6FB", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1.3 1.8 1.4 2.5h5.2c.1-.7.6-1.7 1.4-2.5A6 6 0 0 0 12 3z"
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Xatoingiz tushuntiriladi</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
                Noto&apos;g&apos;ri javob tanlasangiz, aynan qaysi xatoni qilganingizni aytamiz: sin o&apos;rniga cos, unutilgan ishqalanish va hokazo.
              </div>
            </div>

            <div className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: "#FBE3D2", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z"
                    fill="none"
                    stroke="#C2410C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Kunlik streak</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
                Har kuni 10 ta savol. Seriyani uzmang — muntazamlik tayyorgarlikning kaliti.
              </div>
            </div>

            <div className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: "#D7EEDC", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l3 2M9 2h6"
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Haqiqiy formatdagi mock test</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
                45 savol, 150 daqiqa, savollar navigatori va belgilab qo&apos;yish — kompyuterdagi imtihon kabi.
              </div>
            </div>

            <div className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: "#F3E8C9", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M4 20V10M10 20V4M16 20v-7M22 20H2"
                    fill="none"
                    stroke="#8A5A00"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Zaif mavzular tahlili</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
                Qaysi bo&apos;limda kuchli, qayerda zaif ekaningizni statistika aniq ko&apos;rsatadi.
              </div>
            </div>

            <div className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
              <span style={{ width: 48, height: 48, borderRadius: 14, background: "#DCE6FB", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2"
                    fill="none"
                    stroke="#1D4ED8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700 }}>Telegram ichida</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
                Ilova yuklab olish shart emas. Telefonda ham, kompyuterda ham ishlaydi, sekin internetda ham ochiladi.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.wrap} style={{ paddingTop: 72, paddingBottom: 72 }}>
        <span className={styles.kicker}>Qanday ishlaydi</span>
        <h2 className={styles.h2} style={{ marginTop: 8 }}>
          Uch qadam, har kuni
        </h2>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div className={styles.card} style={{ padding: 24 }}>
            <svg width="100%" height="120" viewBox="0 0 260 120" aria-hidden="true">
              <rect x="0" y="0" width="260" height="120" rx="14" fill="#FBE3D2" />
              <rect x="70" y="22" width="120" height="78" rx="8" fill="#FFFFFF" stroke="#1B2430" strokeWidth="2.5" />
              <path d="M130 22v78" stroke="#1B2430" strokeWidth="2.5" />
              <path d="M84 42h32M84 56h28M84 70h32M144 42h32M144 56h24" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: "#1B2430", color: "#F6F1E7", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                1
              </span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Mavzuni o&apos;qing</span>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
              Qisqa nazariya, asosiy formulalar va yechilgan misollar. Bir mavzu — besh daqiqa.
            </p>
          </div>
          <div className={styles.card} style={{ padding: 24 }}>
            <svg width="100%" height="120" viewBox="0 0 260 120" aria-hidden="true">
              <rect x="0" y="0" width="260" height="120" rx="14" fill="#DCE6FB" />
              <path d="M78 96 L190 96 L190 32 Z" fill="#FFFFFF" stroke="#1B2430" strokeWidth="2.5" strokeLinejoin="round" />
              <g transform="translate(140 61) rotate(-29.7)">
                <rect x="-16" y="-24" width="32" height="24" rx="4" fill="#1D4ED8" />
                <path d="M20 -12 H44" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
                <path d="M38 -17 L45 -12 L38 -7" fill="none" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: "#1B2430", color: "#F6F1E7", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                2
              </span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Mashq qiling</span>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
              Kuniga 10 ta savol. Xato qilsangiz — qayerda adashganingizni aytamiz va yechimni animatsiyada ko&apos;rsatamiz.
            </p>
          </div>
          <div className={styles.card} style={{ padding: 24 }}>
            <svg width="100%" height="120" viewBox="0 0 260 120" aria-hidden="true">
              <rect x="0" y="0" width="260" height="120" rx="14" fill="#D7EEDC" />
              <circle cx="130" cy="66" r="38" fill="#FFFFFF" stroke="#1B2430" strokeWidth="2.5" />
              <rect x="122" y="16" width="16" height="10" rx="3" fill="#1B2430" />
              <path d="M130 66 L130 42" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
              <path d="M130 66 L148 76" stroke="#C2410C" strokeWidth="3" strokeLinecap="round" />
              <circle cx="130" cy="66" r="4" fill="#1B2430" />
            </svg>
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: "#1B2430", color: "#F6F1E7", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                3
              </span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Mock test topshiring</span>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#5B6470" }}>
              45 savol, 150 daqiqa. Natijada bo&apos;limlar kesimi va qaysi mavzularni takrorlash kerakligi chiqadi.
            </p>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section style={{ background: "#FFFFFF", borderTop: "1px solid #EAE3D5" }}>
          <div className={styles.wrap} style={{ paddingTop: 72, paddingBottom: 72 }}>
            <span className={styles.kicker}>Fikrlar</span>
            <h2 className={styles.h2} style={{ marginTop: 8 }}>
              O&apos;quvchilar nima deydi
            </h2>
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.card} style={{ padding: 24, background: "#FBF8F2" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "#3A4552" }}>&quot;{review.text}&quot;</p>
                  <p style={{ marginTop: 14, fontSize: 14, fontWeight: 700 }}>{review.displayName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="savollar" style={{ background: "#FFFFFF", borderTop: "1px solid #EAE3D5" }}>
        <div className={styles.wrap} style={{ paddingTop: 72, paddingBottom: 72, display: "flex", flexWrap: "wrap", gap: "32px 56px" }}>
          <div style={{ flex: "1 1 300px", minWidth: 0 }}>
            <span className={styles.kicker}>Savol-javob</span>
            <h2 className={styles.h2} style={{ marginTop: 8 }}>
              Ko&apos;p so&apos;raladigan savollar
            </h2>
            <p className={styles.lead} style={{ fontSize: 16 }}>
              Javob topa olmadingizmi? Telegram botimizga yozing{env.telegramBotUsername ? ` — @${env.telegramBotUsername}` : ""}.
            </p>
          </div>
          <div style={{ flex: "2 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {faq.map((item) => (
              <details key={item.q} className={`${styles.card} ${styles.details}`} style={{ padding: "0 22px", background: "#FBF8F2" }}>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, minHeight: 62, fontSize: 17, fontWeight: 600 }}>
                  {item.q}
                  <PlusIcon />
                </summary>
                <p style={{ margin: "0 0 20px", fontSize: 16, lineHeight: 1.6, color: "#4A5360" }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.wrap} style={{ paddingTop: 24, paddingBottom: 72 }}>
        <div
          style={{
            borderRadius: 28,
            background: "#1B2430",
            color: "#F6F1E7",
            padding: "48px 40px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "28px 40px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ flex: "1 1 420px", minWidth: 0, position: "relative" }}>
            <h2 className={styles.h2} style={{ color: "#FFFFFF" }}>
              Sertifikatga bugundan tayyorlaning
            </h2>
            <p style={{ margin: "12px 0 0", fontSize: 17, lineHeight: 1.6, color: "#C9CFD8", maxWidth: 520 }}>
              Telegram orqali 30 soniyada kirasiz. Birinchi 10 ta savolni bugun yeching.
            </p>
          </div>
          <Link className={styles.btn} href="/kirish" style={{ position: "relative" }}>
            Bepul boshlash
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #EAE3D5" }}>
        <div className={styles.wrap} style={{ paddingTop: 28, paddingBottom: 36, display: "flex", flexWrap: "wrap", gap: "12px 32px", alignItems: "center", fontSize: 14, color: "#5B6470" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#1B2430" }}>
            fizzo<span style={{ color: "#C2410C" }}>.</span>
          </span>
          <span>Fizikadan milliy sertifikatga bepul onlayn tayyorgarlik</span>
          <span style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: "8px 22px" }}>
            <a href="#" style={{ color: "#5B6470" }}>
              Maxfiylik siyosati
            </a>
            <a href="#" style={{ color: "#5B6470" }}>
              Foydalanish shartlari
            </a>
            <span>© 2026 Fizzo</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
