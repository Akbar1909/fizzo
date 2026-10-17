import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import type {
  OAnswer,
  QuestionFigure,
  QuestionMistakes,
  QuestionOptions,
  QuestionSolution,
  Y2Answer,
} from "../src/lib/content-types";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

interface SectionSeed {
  code: string;
  name: string;
  order: number;
  isOpen: boolean;
  topics: { code: string; name: string; order: number }[];
}

const SECTIONS: SectionSeed[] = [
  {
    code: "1",
    name: "Mexanika",
    order: 1,
    isOpen: true,
    topics: [
      { code: "1.1", name: "Kinematika", order: 1 },
      { code: "1.2", name: "Dinamika", order: 2 },
      { code: "1.3", name: "Statika", order: 3 },
      { code: "1.4", name: "Suyuqliklar va gazlar mexanikasi", order: 4 },
      { code: "1.5", name: "Mexanikada saqlanish qonunlari", order: 5 },
      { code: "1.6", name: "Mexanik tebranishlar va to'lqinlar", order: 6 },
    ],
  },
  {
    code: "2",
    name: "Molekulyar fizika va termodinamika",
    order: 2,
    isOpen: false,
    topics: [
      { code: "2.1", name: "Molekulyar fizika", order: 1 },
      { code: "2.2", name: "Termodinamika", order: 2 },
      { code: "2.3", name: "Suyuqlik va qattiq jismlarning xossalari", order: 3 },
    ],
  },
  {
    code: "3",
    name: "Elektr va magnitizm",
    order: 3,
    isOpen: false,
    topics: [
      { code: "3.1", name: "Elektrostatika", order: 1 },
      { code: "3.2", name: "O'zgarmas tok qonunlari", order: 2 },
      { code: "3.3", name: "Turli muhitlarda elektr toki", order: 3 },
      { code: "3.4", name: "Magnitizm", order: 4 },
      { code: "3.5", name: "Elektromagnit tebranishlar va to'lqinlar", order: 5 },
    ],
  },
  {
    code: "4",
    name: "Optika. Nisbiylik nazariyasi asoslari",
    order: 4,
    isOpen: false,
    topics: [
      { code: "4.1", name: "Geometrik optika", order: 1 },
      { code: "4.2", name: "To'lqin optikasi", order: 2 },
      { code: "4.3", name: "Nisbiylik nazariyasi asoslari", order: 3 },
    ],
  },
  {
    code: "5",
    name: "Kvant fizikasi. Atom va yadro fizikasi",
    order: 5,
    isOpen: false,
    topics: [
      { code: "5.1", name: "Kvant fizikasi", order: 1 },
      { code: "5.2", name: "Atom va yadro fizikasi", order: 2 },
    ],
  },
];

interface QuestionSeed {
  slug: string;
  topicCode: string;
  type: "Y1" | "Y2" | "O";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  options?: QuestionOptions;
  answer: string | Y2Answer | OAnswer;
  solution: QuestionSolution;
  mistakes?: QuestionMistakes;
  figure?: QuestionFigure;
}

const QUESTIONS: QuestionSeed[] = [
  {
    slug: "din-001",
    topicCode: "1.2",
    type: "Y1",
    difficulty: "EASY",
    text: "Massasi 5 kg bo'lgan jismga 20 N kuch ta'sir qilmoqda. Jism qanday tezlanish oladi?",
    options: [
      { key: "A", text: "4 m/s²" },
      { key: "B", text: "100 m/s²" },
      { key: "C", text: "0,25 m/s²" },
      { key: "D", text: "15 m/s²" },
    ],
    answer: "A",
    solution: [
      { text: "Nyutonning ikkinchi qonuniga ko'ra $a = F/m$." },
      { text: "$a = 20/5 = 4$ m/s²." },
    ],
    mistakes: [{ when: "B", text: "Kuchni massaga ko'paytirdingiz — bo'lish kerak." }],
  },
  {
    slug: "din-002",
    topicCode: "1.2",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Massasi 10 kg bo'lgan yashik gorizontal sirtda 50 N gorizontal kuch bilan tortilmoqda. Ishqalanish koeffitsiyenti 0,2. Yashik tezlanishini toping.",
    options: [
      { key: "A", text: "3 m/s²" },
      { key: "B", text: "5 m/s²" },
      { key: "C", text: "7 m/s²" },
      { key: "D", text: "2 m/s²" },
    ],
    answer: "A",
    solution: [
      { text: "Ishqalanish kuchi $F_{ishq} = \\mu m g = 0{,}2 \\cdot 10 \\cdot 10 = 20$ N." },
      { text: "$a = (F - F_{ishq})/m = (50 - 20)/10 = 3$ m/s²." },
    ],
    mistakes: [{ when: "B", text: "Ishqalanish kuchini hisobga olmadingiz." }],
  },
  {
    slug: "din-003",
    topicCode: "1.2",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Massasi 2 kg bo'lgan jism qiyalik burchagi 30° bo'lgan silliq tekislikdan sirpanib tushmoqda. Tezlanishni toping.",
    options: [
      { key: "A", text: "5 m/s²" },
      { key: "B", text: "10 m/s²" },
      { key: "C", text: "8,7 m/s²" },
      { key: "D", text: "2,5 m/s²" },
    ],
    answer: "A",
    solution: [{ text: "$a = g\\sin30° = 10 \\cdot 0{,}5 = 5$ m/s²." }],
    mistakes: [
      { when: "C", text: "Yo'l to'g'ri, faqat sin o'rniga cos olindi: cos 30° ≈ 0,87." },
    ],
    figure: { template: "incline", params: { angle: 30, mass: 2, mu: 0 } },
  },
  {
    slug: "din-004",
    topicCode: "1.2",
    type: "Y1",
    difficulty: "HARD",
    text: "Jism qiyalik burchagi 30° bo'lgan qiya tekislikdan sirpanib tushmoqda. Ishqalanish koeffitsiyenti 0,2. Tezlanishni toping.",
    options: [
      { key: "A", text: "3,3 m/s²" },
      { key: "B", text: "6,7 m/s²" },
      { key: "C", text: "7,7 m/s²" },
      { key: "D", text: "5 m/s²" },
    ],
    answer: "A",
    solution: [
      { text: "$a = g(\\sin30° - \\mu\\cos30°)$." },
      { text: "$a = 10(0{,}5 - 0{,}2 \\cdot 0{,}866) \\approx 3{,}3$ m/s²." },
    ],
    mistakes: [
      { when: "B", text: "Ishqalanish harakatga qarshi — ayirish kerak, qo'shish emas." },
      { when: "C", text: "sin va cos o'rni almashib qolgan." },
      { when: "D", text: "Ishqalanish hisobga olinmadi." },
    ],
    figure: { template: "incline", params: { angle: 30, mass: 1, mu: 0.2 } },
  },
  {
    slug: "din-005",
    topicCode: "1.2",
    type: "Y1",
    difficulty: "HARD",
    text: "Ishqalanishsiz blok orqali o'tkazilgan ipning uchlariga 3 kg va 2 kg yuklar osilgan. Yuklarning tezlanishini toping.",
    options: [
      { key: "A", text: "2 m/s²" },
      { key: "B", text: "10 m/s²" },
      { key: "C", text: "5 m/s²" },
      { key: "D", text: "4 m/s²" },
    ],
    answer: "A",
    solution: [{ text: "$a = (m_1 - m_2)g/(m_1+m_2) = (3-2)\\cdot10/5 = 2$ m/s²." }],
    figure: { template: "atwood", params: { m1: 3, m2: 2 } },
  },
  {
    slug: "din-006",
    topicCode: "1.2",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Lift 2 m/s² tezlanish bilan yuqoriga ko'tarilmoqda. Liftdagi 60 kg massali odamning vazni qancha?",
    options: [
      { key: "A", text: "720 N" },
      { key: "B", text: "600 N" },
      { key: "C", text: "480 N" },
      { key: "D", text: "120 N" },
    ],
    answer: "A",
    solution: [{ text: "$P = m(g+a) = 60(10+2) = 720$ N." }],
    mistakes: [{ when: "C", text: "Tezlanish yuqoriga — vazn ortadi, kamaymaydi." }],
  },
  {
    slug: "din-007",
    topicCode: "1.2",
    type: "O",
    difficulty: "HARD",
    text: "Massasi 2 kg bo'lgan brusok gorizontal sirtda turibdi. Unga gorizontga 30° burchak ostida yuqoriga yo'nalgan 10 N kuch ta'sir qiladi. Ishqalanish koeffitsiyenti 0,1.",
    options: [
      { key: "a", label: "Normal reaksiya kuchi", unit: "N" },
      { key: "b", label: "Brusok tezlanishi", unit: "m/s²" },
    ],
    answer: { values: { a: 15, b: 3.6 }, tolerance: 0.03 },
    solution: [
      { text: "$N = mg - F\\sin30° = 20 - 5 = 15$ N." },
      { text: "$F_{ishq} = \\mu N = 0{,}1 \\cdot 15 = 1{,}5$ N." },
      { text: "$a = (F\\cos30° - F_{ishq})/m = (8{,}66 - 1{,}5)/2 \\approx 3{,}6$ m/s²." },
    ],
  },
  {
    slug: "din-008",
    topicCode: "1.2",
    type: "Y2",
    difficulty: "MEDIUM",
    text: "Fizik kattalikni mos SI birligiga ulang.",
    options: {
      left: [
        { key: "1", text: "Kuch" },
        { key: "2", text: "Bikrlik" },
        { key: "3", text: "Tezlanish" },
        { key: "4", text: "Ishqalanish koeffitsiyenti" },
      ],
      right: [
        { key: "A", text: "N/m" },
        { key: "B", text: "birliksiz" },
        { key: "C", text: "N" },
        { key: "D", text: "m/s²" },
      ],
    },
    answer: { "1": "C", "2": "A", "3": "D", "4": "B" },
    solution: [
      { text: "Kuch — Nyuton (N)." },
      { text: "Bikrlik — N/m." },
      { text: "Tezlanish — m/s²." },
      { text: "Ishqalanish koeffitsiyenti — birliksiz kattalik." },
    ],
  },
  {
    slug: "kin-001",
    topicCode: "1.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Tosh 45 m balandlikdan boshlang'ich tezliksiz erkin tushmoqda. Tosh yerga necha soniyada yetib boradi? ($g = 10$ m/s² deb oling.)",
    options: [
      { key: "A", text: "3 s" },
      { key: "B", text: "9 s" },
      { key: "C", text: "4,5 s" },
      { key: "D", text: "6 s" },
    ],
    answer: "A",
    solution: [
      { text: "Erkin tushishda $h = \\dfrac{1}{2}gt^2$, bundan $t = \\sqrt{\\dfrac{2h}{g}}$." },
      { text: "$t = \\sqrt{\\dfrac{2 \\cdot 45}{10}} = \\sqrt{9} = 3$ s." },
    ],
    mistakes: [
      { when: "B", text: "Kvadrat ildiz olishni unutdingiz: $t \\ne \\dfrac{2h}{g}$, balki $t = \\sqrt{\\dfrac{2h}{g}}$." },
      { when: "C", text: "Formula noto'g'ri qo'llanildi: $t \\ne h/g$." },
    ],
    figure: { template: "free-fall", params: { height: 45 } },
  },
  {
    slug: "kin-002",
    topicCode: "1.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Jism 80 m balandlikdan boshlang'ich tezliksiz erkin tushmoqda. Yerga yetganda uning tezligi qanday bo'ladi? ($g = 10$ m/s² deb oling.)",
    options: [
      { key: "A", text: "40 m/s" },
      { key: "B", text: "1600 m/s" },
      { key: "C", text: "28,3 m/s" },
      { key: "D", text: "8 m/s" },
    ],
    answer: "A",
    solution: [
      { text: "Erkin tushishda $v^2 = 2gh$, bundan $v = \\sqrt{2gh}$." },
      { text: "$v = \\sqrt{2 \\cdot 10 \\cdot 80} = \\sqrt{1600} = 40$ m/s." },
    ],
    mistakes: [
      { when: "B", text: "Bu $v^2$ ning qiymati — tezlikning o'zini topish uchun kvadrat ildiz olish kerak." },
      { when: "D", text: "Formula noto'g'ri qo'llanildi: $v \\ne h/g$." },
    ],
    figure: { template: "free-fall", params: { height: 80 } },
  },
  {
    slug: "kin-003",
    topicCode: "1.1",
    type: "O",
    difficulty: "HARD",
    text: "Jism 20 m balandlikdan boshlang'ich tezliksiz erkin tushmoqda. Yerga yetguncha ketgan vaqtni va yerga urilish tezligini toping. ($g = 10$ m/s² deb oling.)",
    options: [
      { key: "a", label: "Tushish vaqti", unit: "s" },
      { key: "b", label: "Yerga urilish tezligi", unit: "m/s" },
    ],
    answer: { values: { a: 2, b: 20 }, tolerance: 0.03 },
    solution: [
      { text: "Tushish vaqti: $t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{2 \\cdot 20}{10}} = \\sqrt{4} = 2$ s." },
      { text: "Yerga urilish tezligi: $v = gt = 10 \\cdot 2 = 20$ m/s." },
    ],
    figure: { template: "free-fall", params: { height: 20 } },
  },
  {
    slug: "stat-001",
    topicCode: "1.3",
    type: "Y1",
    difficulty: "EASY",
    text: "Richagning tayanch nuqtasidan 0,3 m masofada unga perpendikulyar 20 N kuch ta'sir qilmoqda. Bu kuchning tayanch nuqtaga nisbatan momentini toping.",
    options: [
      { key: "A", text: "60 N·m" },
      { key: "B", text: "6 N·m" },
      { key: "C", text: "0,015 N·m" },
      { key: "D", text: "20,3 N·m" },
    ],
    answer: "B",
    solution: [
      { text: "Kuch momenti $M = F \\cdot d$." },
      { text: "$M = 20 \\cdot 0{,}3 = 6$ N·m." },
    ],
    mistakes: [
      { when: "A", text: "Masofa 0,3 m, 3 m emas — vergul joyiga e'tibor bering." },
      { when: "C", text: "Ko'paytirish o'rniga bo'lib yubordingiz." },
    ],
  },
  {
    slug: "stat-002",
    topicCode: "1.3",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Ikki yelkali richagning bir tomoniga tayanch nuqtadan 40 sm masofada 15 N kuch qo'yilgan. Richag muvozanatda bo'lishi uchun ikkinchi tomonga tayanch nuqtadan qanday masofada 10 N kuch qo'yish kerak?",
    options: [
      { key: "A", text: "26,7 sm" },
      { key: "B", text: "40 sm" },
      { key: "C", text: "60 sm" },
      { key: "D", text: "15 sm" },
    ],
    answer: "C",
    solution: [
      { text: "Richag muvozanati: $F_1 d_1 = F_2 d_2$." },
      { text: "$d_2 = \\dfrac{F_1 d_1}{F_2} = \\dfrac{15 \\cdot 40}{10} = 60$ sm." },
    ],
    mistakes: [{ when: "A", text: "Kuch va masofalarni teskari joylashtirdingiz." }],
  },
  {
    slug: "stat-003",
    topicCode: "1.3",
    type: "Y1",
    difficulty: "EASY",
    text: "Jismga bir to'g'ri chiziq bo'ylab ikkita kuch ta'sir qilmoqda: 5 N o'ngga va 3 N chapga. Jism muvozanatda bo'lishi uchun unga ta'sir qiluvchi uchinchi F kuch qanday bo'lishi kerak?",
    options: [
      { key: "A", text: "8 N, chapga" },
      { key: "B", text: "2 N, o'ngga" },
      { key: "C", text: "5 N, chapga" },
      { key: "D", text: "2 N, chapga" },
    ],
    answer: "D",
    solution: [
      { text: "Natijaviy kuch: $5 - 3 = 2$ N, o'ngga yo'nalgan." },
      { text: "Muvozanat uchun $F$ shu kuchga teng va qarama-qarshi yo'nalgan bo'lishi kerak: 2 N, chapga." },
    ],
    mistakes: [
      { when: "A", text: "Kuchlar bir chiziq bo'ylab qarama-qarshi — ayirish kerak, qo'shish emas." },
      { when: "B", text: "Kattalik to'g'ri, lekin yo'nalish teskari bo'lishi kerak." },
    ],
  },
  {
    slug: "stat-004",
    topicCode: "1.3",
    type: "O",
    difficulty: "HARD",
    text: "Uzunligi 4 m, og'irligi 40 N bo'lgan bir jinsli taxta ikki uchidagi A va B tayanchlarga qo'yilgan. Taxtaning A uchidan 1 m masofasida 60 N og'irlikdagi yuk turibdi. A va B tayanchlaridagi reaksiya kuchlarini toping.",
    options: [
      { key: "a", label: "A tayanchining reaksiyasi", unit: "N" },
      { key: "b", label: "B tayanchining reaksiyasi", unit: "N" },
    ],
    answer: { values: { a: 65, b: 35 }, tolerance: 0.03 },
    solution: [
      { text: "Taxtaning og'irligi uning markazida (A dan 2 m da), yuk A dan 1 m da joylashgan." },
      { text: "A nuqtaga nisbatan moment tenglamasi: $N_B \\cdot 4 = 40 \\cdot 2 + 60 \\cdot 1 = 140$, bundan $N_B = 35$ N." },
      { text: "Kuchlar muvozanati: $N_A + N_B = 40 + 60 = 100$, bundan $N_A = 100 - 35 = 65$ N." },
    ],
  },
  {
    slug: "stat-005",
    topicCode: "1.3",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Richagning kichik yelkasi 0,2 m, katta yelkasi 0,8 m. Kichik yelkaga 40 N kuch qo'yilsa, richagni muvozanatlash uchun katta yelkaga qanday kuch qo'yish kerak?",
    options: [
      { key: "A", text: "10 N" },
      { key: "B", text: "160 N" },
      { key: "C", text: "40 N" },
      { key: "D", text: "32 N" },
    ],
    answer: "A",
    solution: [
      { text: "$F_1 L_1 = F_2 L_2$." },
      { text: "$F_2 = \\dfrac{40 \\cdot 0{,}2}{0{,}8} = 10$ N." },
    ],
    mistakes: [{ when: "B", text: "Yelkalar nisbati teskari olindi." }],
  },
  {
    slug: "stat-006",
    topicCode: "1.3",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Richagga tayanch nuqtadan 0,5 m masofada, richag yo'nalishiga 30° burchak ostida 40 N kuch qo'yilgan. Bu kuchning momentini toping.",
    options: [
      { key: "A", text: "20 N·m" },
      { key: "B", text: "10 N·m" },
      { key: "C", text: "17,3 N·m" },
      { key: "D", text: "5 N·m" },
    ],
    answer: "B",
    solution: [
      { text: "Burchak ostidagi kuch uchun $M = F d \\sin\\alpha$." },
      { text: "$M = 40 \\cdot 0{,}5 \\cdot \\sin30° = 40 \\cdot 0{,}5 \\cdot 0{,}5 = 10$ N·m." },
    ],
    mistakes: [
      { when: "A", text: "$\\sin\\alpha$ ko'paytuvchisi unutildi." },
      { when: "C", text: "$\\sin$ o'rniga $\\cos$ ishlatildi." },
    ],
  },
  {
    slug: "suy-001",
    topicCode: "1.4",
    type: "Y1",
    difficulty: "EASY",
    text: "Suv ostida 3 m chuqurlikdagi gidrostatik bosimni toping. (Suv zichligi 1000 kg/m³, $g = 10$ m/s², atmosfera bosimini hisobga olmang.)",
    options: [
      { key: "A", text: "3000 Pa" },
      { key: "B", text: "300000 Pa" },
      { key: "C", text: "30000 Pa" },
      { key: "D", text: "30 Pa" },
    ],
    answer: "C",
    solution: [
      { text: "Gidrostatik bosim $P = \\rho g h$." },
      { text: "$P = 1000 \\cdot 10 \\cdot 3 = 30000$ Pa." },
    ],
    mistakes: [
      { when: "A", text: "$g$ ni hisobga olishni unutdingiz." },
      { when: "D", text: "Suyuqlik zichligini ($\\rho$) hisobga olishni unutdingiz." },
    ],
  },
  {
    slug: "suy-002",
    topicCode: "1.4",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Gidravlik presning kichik porsheni yuzi 5 sm², katta porsheni yuzi 200 sm². Kichik porshenga 20 N kuch qo'yilsa, katta porshenda qanday kuch hosil bo'ladi?",
    options: [
      { key: "A", text: "0,5 N" },
      { key: "B", text: "20 N" },
      { key: "C", text: "4000 N" },
      { key: "D", text: "800 N" },
    ],
    answer: "D",
    solution: [
      { text: "Paskal qonuniga ko'ra $\\dfrac{F_1}{S_1} = \\dfrac{F_2}{S_2}$." },
      { text: "$F_2 = \\dfrac{F_1 S_2}{S_1} = \\dfrac{20 \\cdot 200}{5} = 800$ N." },
    ],
    mistakes: [
      { when: "A", text: "Yuzalar nisbati teskari olindi." },
      { when: "C", text: "$S_1$ ga bo'lishni unutdingiz." },
    ],
  },
  {
    slug: "suy-003",
    topicCode: "1.4",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Hajmi $2 \\cdot 10^{-3}$ m³ bo'lgan jism to'liq suvga botirilgan. Jismga ta'sir etuvchi Arximed kuchini toping. (Suv zichligi 1000 kg/m³, $g = 10$ m/s².)",
    options: [
      { key: "A", text: "20 N" },
      { key: "B", text: "2 N" },
      { key: "C", text: "200 N" },
      { key: "D", text: "0,02 N" },
    ],
    answer: "A",
    solution: [
      { text: "Arximed kuchi $F_A = \\rho g V$." },
      { text: "$F_A = 1000 \\cdot 10 \\cdot 0{,}002 = 20$ N." },
    ],
    mistakes: [
      { when: "B", text: "$g$ ni hisobga olishni unutdingiz." },
      { when: "D", text: "Suyuqlik zichligini hisobga olishni unutdingiz." },
    ],
  },
  {
    slug: "suy-004",
    topicCode: "1.4",
    type: "Y1",
    difficulty: "HARD",
    text: "Zichligi 600 kg/m³ bo'lgan jism suvda (zichligi 1000 kg/m³) suzib yuribdi. Jismning necha foiz qismi suv ostida qolgan?",
    options: [
      { key: "A", text: "40%" },
      { key: "B", text: "60%" },
      { key: "C", text: "167%" },
      { key: "D", text: "6%" },
    ],
    answer: "B",
    solution: [
      { text: "Suzish sharti: $\\rho_{jism} V g = \\rho_{suv} V_{botgan} g$." },
      { text: "$\\dfrac{V_{botgan}}{V} = \\dfrac{\\rho_{jism}}{\\rho_{suv}} = \\dfrac{600}{1000} = 0{,}6 = 60\\%$." },
    ],
    mistakes: [{ when: "A", text: "Bu suv USTIDA qolgan qism — savol suv OSTIDAGI qismni so'ragan." }],
  },
  {
    slug: "suy-005",
    topicCode: "1.4",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Trubaning keng qismida kesim yuzi 6 sm², tor qismida 2 sm². Keng qismda suyuqlik tezligi 2 m/s. Tor qismdagi tezlikni toping.",
    options: [
      { key: "A", text: "0,67 m/s" },
      { key: "B", text: "2 m/s" },
      { key: "C", text: "6 m/s" },
      { key: "D", text: "3 m/s" },
    ],
    answer: "C",
    solution: [
      { text: "Uzluksizlik tenglamasi: $S_1 v_1 = S_2 v_2$." },
      { text: "$v_2 = \\dfrac{S_1 v_1}{S_2} = \\dfrac{6 \\cdot 2}{2} = 6$ m/s." },
    ],
    mistakes: [{ when: "A", text: "Keng va tor qismlar nisbati teskari olindi." }],
  },
  {
    slug: "suy-006",
    topicCode: "1.4",
    type: "Y1",
    difficulty: "EASY",
    text: "Yuzi 0,5 m² bo'lgan sirtga perpendikulyar 200 N kuch ta'sir qilmoqda. Sirtga tushirilgan bosimni toping.",
    options: [
      { key: "A", text: "100 Pa" },
      { key: "B", text: "0,0025 Pa" },
      { key: "C", text: "200 Pa" },
      { key: "D", text: "400 Pa" },
    ],
    answer: "D",
    solution: [
      { text: "Bosim $P = F/S$." },
      { text: "$P = 200/0{,}5 = 400$ Pa." },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish o'rniga ko'paytirdingiz." },
      { when: "C", text: "Yuzani hisobga olishni unutdingiz." },
    ],
  },
  {
    slug: "sql-001",
    topicCode: "1.5",
    type: "Y1",
    difficulty: "EASY",
    text: "Massasi 2 kg bo'lgan jism 3 m/s tezlik bilan harakatlanib, tinch turgan 1 kg massali jismga urilib, ular birga harakatlana boshlaydi. To'qnashuvdan keyingi tezlikni toping.",
    options: [
      { key: "A", text: "2 m/s" },
      { key: "B", text: "6 m/s" },
      { key: "C", text: "3 m/s" },
      { key: "D", text: "4,5 m/s" },
    ],
    answer: "A",
    solution: [
      { text: "Impuls saqlanish qonuni: $m_1 v_1 = (m_1+m_2)v$." },
      { text: "$v = \\dfrac{2 \\cdot 3}{2+1} = 2$ m/s." },
    ],
    mistakes: [{ when: "B", text: "Umumiy massaga bo'lishni unutdingiz." }],
  },
  {
    slug: "sql-002",
    topicCode: "1.5",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Jism 5 m balandlikdan boshlang'ich tezliksiz erkin tushmoqda. Energiyaning saqlanish qonunidan foydalanib, yerga yetgandagi tezlikni toping. ($g = 10$ m/s² deb oling.)",
    options: [
      { key: "A", text: "50 m/s" },
      { key: "B", text: "10 m/s" },
      { key: "C", text: "7,07 m/s" },
      { key: "D", text: "100 m/s" },
    ],
    answer: "B",
    solution: [
      { text: "Energiya saqlanishi: $mgh = \\dfrac{mv^2}{2}$, bundan $v = \\sqrt{2gh}$." },
      { text: "$v = \\sqrt{2 \\cdot 10 \\cdot 5} = \\sqrt{100} = 10$ m/s." },
    ],
    mistakes: [
      { when: "A", text: "Kvadrat ildiz olishni unutdingiz." },
      { when: "C", text: "Formuladagi 2 ko'paytuvchisi unutildi." },
    ],
    figure: { template: "free-fall", params: { height: 5 } },
  },
  {
    slug: "sql-003",
    topicCode: "1.5",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Massasi 0,5 kg bo'lgan jism 2 m balandlikdagi tog'dan ishqalanishsiz pastga sirg'anib tushmoqda. Pastga tushganda jismning kinetik energiyasini toping. ($g = 10$ m/s² deb oling.)",
    options: [
      { key: "A", text: "20 J" },
      { key: "B", text: "1 J" },
      { key: "C", text: "10 J" },
      { key: "D", text: "0,2 J" },
    ],
    answer: "C",
    solution: [
      { text: "Energiya saqlanishi: $E_k = mgh$." },
      { text: "$E_k = 0{,}5 \\cdot 10 \\cdot 2 = 10$ J." },
    ],
    mistakes: [
      { when: "A", text: "Massa koeffitsiyenti (0,5) hisobga olinmadi." },
      { when: "B", text: "$g$ ni hisobga olishni unutdingiz." },
    ],
  },
  {
    slug: "sql-004",
    topicCode: "1.5",
    type: "Y1",
    difficulty: "HARD",
    text: "Massalari teng ikkita sharcha bir-biriga qarama-qarshi yo'nalishda, mos ravishda 4 m/s va 2 m/s tezlik bilan harakatlanib to'qnashadi va to'qnashuvdan keyin birga harakatlanadi. Natijaviy tezlikni toping.",
    options: [
      { key: "A", text: "3 m/s" },
      { key: "B", text: "2 m/s" },
      { key: "C", text: "6 m/s" },
      { key: "D", text: "1 m/s" },
    ],
    answer: "D",
    solution: [
      { text: "Qarama-qarshi yo'nalishlarni hisobga olib: $mv = m \\cdot 4 - m \\cdot 2 = 2m$ (umumiy massa $2m$)." },
      { text: "$v = \\dfrac{2m}{2m} = 1$ m/s, tezroq sharcha yo'nalishida." },
    ],
    mistakes: [
      { when: "A", text: "Qarama-qarshi yo'nalishdagi tezliklar ayirilishi kerak, o'rtacha emas." },
      { when: "C", text: "Qarama-qarshi yo'nalish hisobga olinmadi — tezliklar ayirilishi kerak." },
    ],
  },
  {
    slug: "sql-005",
    topicCode: "1.5",
    type: "O",
    difficulty: "MEDIUM",
    text: "Massasi 4 kg bo'lgan jism tekis gorizontal sirt bo'ylab 10 N doimiy kuch ta'sirida 3 m masofaga harakatlanmoqda (ishqalanishsiz, boshlang'ich tezlik nolga teng). Kuchning bajargan ishini va jismning erishgan tezligini toping.",
    options: [
      { key: "a", label: "Bajarilgan ish", unit: "J" },
      { key: "b", label: "Erishilgan tezlik", unit: "m/s" },
    ],
    answer: { values: { a: 30, b: 3.87 }, tolerance: 0.05 },
    solution: [
      { text: "Ish: $A = Fs = 10 \\cdot 3 = 30$ J." },
      { text: "Ish-energiya teoremasi: $A = \\dfrac{mv^2}{2}$, bundan $v = \\sqrt{\\dfrac{2A}{m}} = \\sqrt{\\dfrac{2 \\cdot 30}{4}} = \\sqrt{15} \\approx 3{,}87$ m/s." },
    ],
  },
  {
    slug: "sql-006",
    topicCode: "1.5",
    type: "Y1",
    difficulty: "EASY",
    text: "Massasi 1500 kg bo'lgan avtomobil 20 m/s tezlik bilan harakatlanmoqda. Uning impulsini toping.",
    options: [
      { key: "A", text: "30000 kg·m/s" },
      { key: "B", text: "75 kg·m/s" },
      { key: "C", text: "1520 kg·m/s" },
      { key: "D", text: "3000 kg·m/s" },
    ],
    answer: "A",
    solution: [
      { text: "Impuls $p = mv$." },
      { text: "$p = 1500 \\cdot 20 = 30000$ kg·m/s." },
    ],
    mistakes: [{ when: "B", text: "Ko'paytirish o'rniga bo'lib yubordingiz." }],
  },
  {
    slug: "teb-001",
    topicCode: "1.6",
    type: "Y1",
    difficulty: "EASY",
    text: "Tebranish chastotasi 5 Hz bo'lgan jismning tebranish davrini toping.",
    options: [
      { key: "A", text: "5 s" },
      { key: "B", text: "0,2 s" },
      { key: "C", text: "0,5 s" },
      { key: "D", text: "2 s" },
    ],
    answer: "B",
    solution: [
      { text: "$T = 1/f$." },
      { text: "$T = 1/5 = 0{,}2$ s." },
    ],
    mistakes: [{ when: "A", text: "Davr va chastota bir-biri bilan almashtirib yuborildi." }],
  },
  {
    slug: "teb-002",
    topicCode: "1.6",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Uzunligi 1 m bo'lgan matematik mayatnikning tebranish davrini toping. ($g = 10$ m/s², $\\pi^2 \\approx 10$ deb oling.)",
    options: [
      { key: "A", text: "0,32 s" },
      { key: "B", text: "4 s" },
      { key: "C", text: "2 s" },
      { key: "D", text: "6,3 s" },
    ],
    answer: "C",
    solution: [
      { text: "Matematik mayatnik davri: $T = 2\\pi\\sqrt{l/g}$, bundan $T^2 = 4\\pi^2 \\cdot l/g$." },
      { text: "$T^2 \\approx 4 \\cdot 10 \\cdot (1/10) = 4$, bundan $T = 2$ s." },
    ],
    mistakes: [
      { when: "A", text: "$2\\pi$ ko'paytuvchisini unutdingiz." },
      { when: "B", text: "Bu $T^2$ ning qiymati — $T$ emas, kvadrat ildiz olish kerak." },
    ],
  },
  {
    slug: "teb-003",
    topicCode: "1.6",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Bikrligi 200 N/m bo'lgan prujinaga 2 kg massali yuk osilgan. Tizimning tebranish davrini toping. ($\\pi^2 \\approx 10$ deb oling.)",
    options: [
      { key: "A", text: "0,4 s" },
      { key: "B", text: "0,1 s" },
      { key: "C", text: "1,26 s" },
      { key: "D", text: "0,63 s" },
    ],
    answer: "D",
    solution: [
      { text: "Prujinali mayatnik davri: $T = 2\\pi\\sqrt{m/k}$, bundan $T^2 = 4\\pi^2 \\cdot m/k$." },
      { text: "$T^2 \\approx 4 \\cdot 10 \\cdot (2/200) = 0{,}4$, bundan $T = \\sqrt{0{,}4} \\approx 0{,}63$ s." },
    ],
    mistakes: [
      { when: "A", text: "Bu $T^2$ ning qiymati — $T$ emas, kvadrat ildiz olish kerak." },
      { when: "B", text: "$4\\pi^2$ ko'paytuvchisini unutdingiz." },
    ],
  },
  {
    slug: "teb-004",
    topicCode: "1.6",
    type: "Y1",
    difficulty: "EASY",
    text: "To'lqin uzunligi 2 m, chastotasi 50 Hz bo'lgan to'lqinning tarqalish tezligini toping.",
    options: [
      { key: "A", text: "100 m/s" },
      { key: "B", text: "25 m/s" },
      { key: "C", text: "52 m/s" },
      { key: "D", text: "0,04 m/s" },
    ],
    answer: "A",
    solution: [
      { text: "To'lqin tezligi $v = \\lambda f$." },
      { text: "$v = 2 \\cdot 50 = 100$ m/s." },
    ],
    mistakes: [{ when: "B", text: "Ko'paytirish o'rniga bo'lib yubordingiz." }],
  },
  {
    slug: "teb-005",
    topicCode: "1.6",
    type: "Y1",
    difficulty: "HARD",
    text: "Suv yuzasida to'lqin tarqalmoqda, tezligi 4 m/s, davri 0,5 s. To'lqin uzunligini toping.",
    options: [
      { key: "A", text: "8 m" },
      { key: "B", text: "2 m" },
      { key: "C", text: "0,125 m" },
      { key: "D", text: "4,5 m" },
    ],
    answer: "B",
    solution: [
      { text: "To'lqin uzunligi $\\lambda = vT$." },
      { text: "$\\lambda = 4 \\cdot 0{,}5 = 2$ m." },
    ],
    mistakes: [
      { when: "A", text: "$\\lambda = vT$ o'rniga chastotaga ko'paytirib yubordingiz ($v \\cdot f$)." },
      { when: "C", text: "Nisbat teskari olindi: $T/v$ hisoblandi." },
    ],
  },
  {
    slug: "teb-006",
    topicCode: "1.6",
    type: "O",
    difficulty: "MEDIUM",
    text: "Matematik mayatnik uzunligi 2,5 m. Uning tebranish davri va chastotasini toping. ($g = 10$ m/s², $\\pi^2 \\approx 10$ deb oling.)",
    options: [
      { key: "a", label: "Tebranish davri", unit: "s" },
      { key: "b", label: "Tebranish chastotasi", unit: "Hz" },
    ],
    answer: { values: { a: 3.16, b: 0.316 }, tolerance: 0.05 },
    solution: [
      { text: "$T = 2\\pi\\sqrt{l/g}$, $T^2 = 4\\pi^2 \\cdot l/g \\approx 4 \\cdot 10 \\cdot (2{,}5/10) = 10$, bundan $T = \\sqrt{10} \\approx 3{,}16$ s." },
      { text: "Chastota: $f = 1/T \\approx 1/3{,}16 \\approx 0{,}316$ Hz." },
    ],
  },
];

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

async function main() {
  const sectionIdByCode = new Map<string, string>();
  const topicIdByCode = new Map<string, string>();

  for (const section of SECTIONS) {
    const created = await db.section.upsert({
      where: { code: section.code },
      create: {
        code: section.code,
        name: section.name,
        order: section.order,
        isOpen: section.isOpen,
      },
      update: {
        name: section.name,
        order: section.order,
        isOpen: section.isOpen,
      },
    });
    sectionIdByCode.set(section.code, created.id);

    for (const topic of section.topics) {
      const createdTopic = await db.topic.upsert({
        where: { code: topic.code },
        create: {
          code: topic.code,
          name: topic.name,
          order: topic.order,
          sectionId: created.id,
        },
        update: {
          name: topic.name,
          order: topic.order,
          sectionId: created.id,
        },
      });
      topicIdByCode.set(topic.code, createdTopic.id);
    }
  }

  for (const question of QUESTIONS) {
    const topicId = topicIdByCode.get(question.topicCode);
    if (!topicId) throw new Error(`Unknown topic code: ${question.topicCode}`);

    await db.question.upsert({
      where: { slug: question.slug },
      create: {
        slug: question.slug,
        topicId,
        type: question.type,
        difficulty: question.difficulty,
        text: question.text,
        options: question.options ? json(question.options) : undefined,
        answer: json(question.answer),
        solution: json(question.solution),
        mistakes: question.mistakes ? json(question.mistakes) : undefined,
        figure: question.figure ? json(question.figure) : undefined,
      },
      update: {
        topicId,
        type: question.type,
        difficulty: question.difficulty,
        text: question.text,
        options: question.options ? json(question.options) : undefined,
        answer: json(question.answer),
        solution: json(question.solution),
        mistakes: question.mistakes ? json(question.mistakes) : undefined,
        figure: question.figure ? json(question.figure) : undefined,
      },
    });
  }

  console.log(`Seeded ${SECTIONS.length} sections and ${QUESTIONS.length} questions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
