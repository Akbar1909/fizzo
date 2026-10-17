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
  {
    slug: "mol-001",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Yozda harorat 27°C bo'lganda avtomobil shinasidagi bosim 2,4 atm edi. Qishda harorat −3°C ga tushganda, shina hajmi o'zgarmasa, bosim qancha bo'ladi?",
    options: [
      { key: "A", text: "2,4 atm" },
      { key: "B", text: "2,16 atm" },
      { key: "C", text: "2,67 atm" },
      { key: "D", text: "1,8 atm" },
    ],
    answer: "B",
    solution: [
      { text: "Gey-Lyussak qonuni (hajm o'zgarmas): $P_1/T_1 = P_2/T_2$, $T_1=300$ K, $T_2=270$ K." },
      {
        text: "$P_2 = P_1 \\cdot T_2/T_1 = 2{,}4 \\cdot 270/300 = 2{,}16$ atm.",
        note: "Shuning uchun qishda shina bosimini tekshirib turish kerak — sovuqda bosim pasayadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Yopiq hajmda harorat o'zgarsa, bosim ham o'zgaradi (Gey-Lyussak qonuni)." },
      { when: "C", text: "Harorat nisbati teskari olindi." },
    ],
  },
  {
    slug: "mol-002",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Avtobusning pnevmatik tormoz tizimidagi havo hajmi 300 ml, bosimi 1 atm edi. Tizim ishga tushganda havo 50 ml gacha siqilsa (harorat o'zgarmaydi), bosimni toping.",
    options: [
      { key: "A", text: "0,17 atm" },
      { key: "B", text: "3,5 atm" },
      { key: "C", text: "1,5 atm" },
      { key: "D", text: "6 atm" },
    ],
    answer: "D",
    solution: [
      { text: "Boyl-Mariott qonuni (harorat o'zgarmas): $P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = P_1 V_1 / V_2 = 1 \\cdot 300/50 = 6$ atm.",
        note: "Pnevmatik tormozlar aynan shu tamoyilda — siqilgan havo bosimidan — ishlaydi.",
      },
    ],
    mistakes: [{ when: "A", text: "Hajmlar nisbati teskari olindi." }],
  },
  {
    slug: "mol-003",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Oshxonadagi gaz balonidagi gaz bosimi +17°C haroratda 8 atm. Agar balon issiq joyga qo'yilib, harorat +47°C ga ko'tarilsa (hajm o'zgarmaydi), bosim qancha bo'ladi?",
    options: [
      { key: "A", text: "8,83 atm" },
      { key: "B", text: "7,25 atm" },
      { key: "C", text: "8 atm" },
      { key: "D", text: "10,4 atm" },
    ],
    answer: "A",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=290$ K, $T_2=320$ K." },
      {
        text: "$P_2 = 8 \\cdot 320/290 \\approx 8{,}83$ atm.",
        note: "Shuning uchun gaz balonini issiqda yoki quyosh tagida qoldirish xavfli — bosim ortib ketishi mumkin.",
      },
    ],
    mistakes: [
      { when: "B", text: "Harorat nisbati teskari olindi." },
      { when: "C", text: "Yopiq balonda harorat ko'tarilsa, bosim ham ortadi." },
    ],
  },
  {
    slug: "mol-004",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Tog' etagida 5 litr hajmli shar ichidagi havo bosimi 1 atm. Sharni Chimyon tog'iga olib chiqqanda, tashqi bosim pasayishi natijasida shar hajmi 6 litrga kengaydi (harorat o'zgarmaydi deb hisoblang). Shar ichidagi yangi bosimni toping.",
    options: [
      { key: "A", text: "1,2 atm" },
      { key: "B", text: "1 atm" },
      { key: "C", text: "0,83 atm" },
      { key: "D", text: "0,5 atm" },
    ],
    answer: "C",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1 \\cdot 5/6 \\approx 0{,}83$ atm.",
        note: "Shuning uchun baland tog'larda yopiq idishlar (masalan, chipsi paketi) shishib ketadi — tashqi bosim kamayadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "B", text: "Hajm o'zgarsa, bosim ham o'zgaradi — Boyl-Mariott qonuni." },
    ],
  },
  {
    slug: "mol-005",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Tandir ichidagi harorat 327°C ga yetganda, bu Kelvin shkalasida necha gradusga teng?",
    options: [
      { key: "A", text: "327 K" },
      { key: "B", text: "600 K" },
      { key: "C", text: "54 K" },
      { key: "D", text: "873 K" },
    ],
    answer: "B",
    solution: [
      { text: "Kelvinga o'tish: $T = t + 273$." },
      {
        text: "$T = 327 + 273 = 600$ K.",
        note: "Fizikada barcha gaz qonunlari harorat Kelvin shkalasida bo'lishini talab qiladi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Selsiy darajasini Kelvinga aylantirish uchun 273 qo'shish kerak." },
      { when: "C", text: "Qo'shish o'rniga ayirib yubordingiz." },
    ],
  },
  {
    slug: "mol-006",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Yerda harorat 17°C, bosim 1 atm bo'lganda ob-havo shari hajmi 2 litr edi. Baland balandlikda harorat −23°C ga tushib, bosim 0,5 atm bo'lsa, sharning yangi hajmini toping.",
    options: [
      { key: "A", text: "3,45 litr" },
      { key: "B", text: "4 litr" },
      { key: "C", text: "1,72 litr" },
      { key: "D", text: "4,64 litr" },
    ],
    answer: "A",
    solution: [
      { text: "Birlashgan gaz qonuni: $\\dfrac{P_1 V_1}{T_1} = \\dfrac{P_2 V_2}{T_2}$, $T_1=290$ K, $T_2=250$ K." },
      {
        text: "$V_2 = \\dfrac{P_1 V_1 T_2}{T_1 P_2} = \\dfrac{1 \\cdot 2 \\cdot 250}{290 \\cdot 0{,}5} \\approx 3{,}45$ litr.",
        note: "Shuning uchun baland tog'larga ko'tarilganda yopiq idishlar yoki shishgan shar portlab ketishi mumkin.",
      },
    ],
    mistakes: [
      { when: "B", text: "Faqat bosim o'zgarishini hisobga oldingiz, harorat o'zgarishini unutdingiz." },
      { when: "C", text: "Faqat harorat o'zgarishini hisobga oldingiz, bosim o'zgarishini unutdingiz." },
    ],
  },
  {
    slug: "mol-007",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Shprits ichida 20 ml havo 1 atm bosimda bor edi. Porshenni bosib, havo hajmini 5 ml ga tushirdingiz (harorat o'zgarmaydi). Bosimni toping.",
    options: [
      { key: "A", text: "0,25 atm" },
      { key: "B", text: "1 atm" },
      { key: "C", text: "25 atm" },
      { key: "D", text: "4 atm" },
    ],
    answer: "D",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1 \\cdot 20/5 = 4$ atm.",
        note: "Shuning uchun shprits uchini barmoq bilan bekitib porshenni bossangiz, qattiq qarshilikni sezasiz.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "B", text: "Hajm o'zgarsa, bosim ham o'zgaradi." },
    ],
  },
  {
    slug: "mol-008",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Yopiq qopqoqli qozondagi bug' bosimi 20°C da 1 atm edi. Qozon isitilib harorat 120°C ga yetganda (hajm o'zgarmaydi), bosimni toping.",
    options: [
      { key: "A", text: "0,75 atm" },
      { key: "B", text: "1 atm" },
      { key: "C", text: "1,34 atm" },
      { key: "D", text: "1,6 atm" },
    ],
    answer: "C",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=293$ K, $T_2=393$ K." },
      {
        text: "$P_2 = 1 \\cdot 393/293 \\approx 1{,}34$ atm.",
        note: "Shuning uchun bosim qozonlarida xavfsizlik klapani bo'ladi — bosim haddan tashqari oshsa, bug' chiqarib yuboradi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Harorat nisbati teskari olindi." },
      { when: "B", text: "Yopiq idishda harorat ortsa, bosim ham ortadi." },
    ],
  },
  {
    slug: "mol-009",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Muzlatgich ichidagi harorat 260 K ga teng. Bu Selsiy shkalasida necha gradusga teng?",
    options: [
      { key: "A", text: "−13°C" },
      { key: "B", text: "533°C" },
      { key: "C", text: "13°C" },
      { key: "D", text: "−273°C" },
    ],
    answer: "A",
    solution: [
      { text: "Selsiyga o'tish: $t = T - 273$." },
      {
        text: "$t = 260 - 273 = -13$°C.",
        note: "Muzlatgichdagi haroratlar ko'pincha manfiy Selsiy gradusida bo'ladi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Kelvindan Selsiyga o'tishda 273 ayirish kerak, qo'shish emas." },
      { when: "C", text: "Ishorani (minus) unutdingiz." },
    ],
  },
  {
    slug: "mol-010",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Pompa silindrida 400 sm³ havo atmosfera bosimida (1 atm) bor edi. Dastakni bosib, havoni 80 sm³ gacha siqdingiz (harorat o'zgarmaydi). Bosimni toping.",
    options: [
      { key: "A", text: "0,2 atm" },
      { key: "B", text: "5 atm" },
      { key: "C", text: "1 atm" },
      { key: "D", text: "4 atm" },
    ],
    answer: "B",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1 \\cdot 400/80 = 5$ atm.",
        note: "Shuning uchun pompa dastagini bosganda qarshilik his qilinadi — havo siqilib bosimi ortadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "C", text: "Hajm kamaysa, bosim ortadi — bosim o'zgarmay qolmaydi." },
    ],
  },
  {
    slug: "mol-011",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Sovuqda (−13°C, 0,8 atm) saqlangan basketbol to'pining hajmi 7 litr edi. Uni issiq xonaga (27°C) olib kirib, bosimini 1,2 atm ga pompaladingiz. To'pning yangi hajmini toping.",
    options: [
      { key: "A", text: "8,08 litr" },
      { key: "B", text: "4,67 litr" },
      { key: "C", text: "5,38 litr" },
      { key: "D", text: "4,04 litr" },
    ],
    answer: "C",
    solution: [
      { text: "$\\dfrac{P_1 V_1}{T_1} = \\dfrac{P_2 V_2}{T_2}$, $T_1=260$ K, $T_2=300$ K." },
      {
        text: "$V_2 = \\dfrac{P_1 V_1 T_2}{T_1 P_2} = \\dfrac{0{,}8 \\cdot 7 \\cdot 300}{260 \\cdot 1{,}2} \\approx 5{,}38$ litr.",
        note: "Shuning uchun qishda tashqarida saqlangan to'p sovuqdan 'pachaqlanib' qoladi — issiqqa kirgach yana shishadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bosim o'zgarishini hisobga olmadingiz." },
      { when: "B", text: "Harorat o'zgarishini hisobga olmadingiz." },
    ],
  },
  {
    slug: "mol-012",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Gaz balonidagi bosim 7°C da 5 atm edi. Balonni iliq uyga olib kirib, harorat 27°C ga ko'tarilganda (hajm o'zgarmaydi), bosimni toping.",
    options: [
      { key: "A", text: "4,67 atm" },
      { key: "B", text: "5 atm" },
      { key: "C", text: "6 atm" },
      { key: "D", text: "5,36 atm" },
    ],
    answer: "D",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=280$ K, $T_2=300$ K." },
      {
        text: "$P_2 = 5 \\cdot 300/280 \\approx 5{,}36$ atm.",
        note: "Shuning uchun gaz balonlarini sovuq, salqin joyda saqlash tavsiya etiladi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Harorat nisbati teskari olindi." },
      { when: "B", text: "Harorat ortsa, yopiq idishda bosim ham ortadi." },
    ],
  },
  {
    slug: "mol-013",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "64 g kislorod gazida necha mol modda bor? (Kislorodning molyar massasi 32 g/mol.)",
    options: [
      { key: "A", text: "0,5 mol" },
      { key: "B", text: "2 mol" },
      { key: "C", text: "2048 mol" },
      { key: "D", text: "64 mol" },
    ],
    answer: "B",
    solution: [
      { text: "Modda miqdori $\\nu = m/M$." },
      {
        text: "$\\nu = 64/32 = 2$ mol.",
        note: "Molyar massa — moddaning 1 mol miqdoridagi massasi, davriy jadvaldan topiladi.",
      },
    ],
    mistakes: [{ when: "A", text: "Bo'lish yo'nalishi teskari olindi: $\\nu = m/M$." }],
  },
  {
    slug: "mol-014",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "3 mol gazda nechta molekula borligini toping. (Avogadro soni $N_A = 6 \\cdot 10^{23}$ 1/mol.)",
    options: [
      { key: "A", text: "1,8·10²⁴" },
      { key: "B", text: "0,5·10²³" },
      { key: "C", text: "1,8" },
      { key: "D", text: "9·10²³" },
    ],
    answer: "A",
    solution: [
      { text: "Molekulalar soni $N = \\nu N_A$." },
      {
        text: "$N = 3 \\cdot 6\\cdot10^{23} = 1{,}8\\cdot10^{24}$.",
        note: "Avogadro soni juda katta — shuning uchun kundalik hajmdagi gazda trillionlab molekulalar bo'ladi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Ko'paytirish o'rniga bo'lib yubordingiz." },
      { when: "C", text: "Daraja ($10^{24}$) unutildi." },
    ],
  },
  {
    slug: "mol-015",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Termizda yozgi kunlardan birida havo harorati 45°C ni tashkil etdi. Bu Kelvin shkalasida necha gradusga teng?",
    options: [
      { key: "A", text: "45 K" },
      { key: "B", text: "−228 K" },
      { key: "C", text: "300 K" },
      { key: "D", text: "318 K" },
    ],
    answer: "D",
    solution: [
      { text: "$T = t + 273$." },
      {
        text: "$T = 45 + 273 = 318$ K.",
        note: "Termiz O'zbekistondagi eng issiq shaharlardan biri — yozda harorat 45°C dan oshishi odatiy hol.",
      },
    ],
    mistakes: [
      { when: "A", text: "Kelvinga o'tishda 273 qo'shish kerak." },
      { when: "B", text: "Qo'shish o'rniga ayirib yubordingiz." },
    ],
  },
  {
    slug: "mol-016",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Suv quvurini tozalashda ishlatiladigan kompressorda 2 atm bosimda 10 litr havo bor edi. Havoni siqib hajmini 4 litrga tushirsangiz, bosimni toping (harorat o'zgarmaydi).",
    options: [
      { key: "A", text: "0,8 atm" },
      { key: "B", text: "2 atm" },
      { key: "C", text: "5 atm" },
      { key: "D", text: "6 atm" },
    ],
    answer: "C",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 2 \\cdot 10/4 = 5$ atm.",
        note: "Kompressorlar aynan shu tamoyil — havoni siqib bosimni oshirish — asosida ishlaydi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "B", text: "Hajm kamaysa, bosim ortishi kerak." },
    ],
  },
  {
    slug: "mol-017",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "5 mol azot gazining massasini toping. (Azotning molyar massasi 28 g/mol.)",
    options: [
      { key: "A", text: "140 g" },
      { key: "B", text: "5,6 g" },
      { key: "C", text: "23 g" },
      { key: "D", text: "33 g" },
    ],
    answer: "A",
    solution: [
      { text: "Massa $m = \\nu M$." },
      {
        text: "$m = 5 \\cdot 28 = 140$ g.",
        note: "Massa, mol miqdori va molyar massa orasidagi bog'lanish kimyoda ham ishlatiladi.",
      },
    ],
    mistakes: [{ when: "B", text: "Ko'paytirish o'rniga bo'lib yubordingiz." }],
  },
  {
    slug: "mol-018",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Dvigatel ishlagandan keyin, silindrdagi gaz harorati 500°C, bosimi 3 atm edi. Dvigatel sovib, harorat 25°C ga tushganda (hajm o'zgarmaydi), bosimni toping.",
    options: [
      { key: "A", text: "7,78 atm" },
      { key: "B", text: "1,16 atm" },
      { key: "C", text: "3 atm" },
      { key: "D", text: "2 atm" },
    ],
    answer: "B",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=773$ K, $T_2=298$ K." },
      {
        text: "$P_2 = 3 \\cdot 298/773 \\approx 1{,}16$ atm.",
        note: "Shuning uchun sovuq dvigatelni ishga tushirishda bosim past bo'ladi — mashina birozdan keyin yaxshi ishlaydi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Harorat nisbati teskari olindi." },
      { when: "C", text: "Harorat pasaysa, yopiq hajmda bosim ham pasayadi." },
    ],
  },
  {
    slug: "mol-019",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Bolalar bayrami uchun pufakchaga 1 atm bosimda 3 litr gaz to'ldirilgan. Baland tog'li hududga olib chiqilganda tashqi bosim pasayib, pufakcha 4 litrgacha kengaydi (harorat o'zgarmaydi). Ichkaridagi bosimni toping.",
    options: [
      { key: "A", text: "1,33 atm" },
      { key: "B", text: "1 atm" },
      { key: "C", text: "0,75 atm" },
      { key: "D", text: "0,5 atm" },
    ],
    answer: "C",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1 \\cdot 3/4 = 0{,}75$ atm.",
        note: "Shuning uchun baland tog'larga olib chiqilgan pufakchalar ba'zan portlab ketadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "B", text: "Hajm ortsa, bosim kamayishi kerak." },
    ],
  },
  {
    slug: "mol-020",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Ochiq havoda dam olish uchun shishiriladigan matrasga kunduzi (27°C) 10 litr havo 1,2 atm bosimda quyilgan edi. Kechqurun harorat 7°C ga tushib, matras hajmi 9 litrga qisqarganda, ichkaridagi bosimni toping.",
    options: [
      { key: "A", text: "1,12 atm" },
      { key: "B", text: "1,33 atm" },
      { key: "C", text: "1,45 atm" },
      { key: "D", text: "1,24 atm" },
    ],
    answer: "D",
    solution: [
      { text: "$\\dfrac{P_1 V_1}{T_1} = \\dfrac{P_2 V_2}{T_2}$, $T_1=300$ K, $T_2=280$ K." },
      {
        text: "$P_2 = \\dfrac{P_1 V_1 T_2}{T_1 V_2} = \\dfrac{1{,}2 \\cdot 10 \\cdot 280}{300 \\cdot 9} \\approx 1{,}24$ atm.",
        note: "Shuning uchun tunda sovib qolgan shishirma matras ertalab bo'shashib qolgandek tuyuladi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajm o'zgarishini hisobga olmadingiz." },
      { when: "B", text: "Harorat o'zgarishini hisobga olmadingiz." },
    ],
  },
  {
    slug: "mol-021",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Dezodorant balonchasi 20°C xonada saqlanganda ichidagi gaz bosimi 4 atm. Agar balonni issiq mashina salonida (70°C) qoldirsangiz, bosim qancha bo'ladi (hajm o'zgarmaydi)?",
    options: [
      { key: "A", text: "3,42 atm" },
      { key: "B", text: "4 atm" },
      { key: "C", text: "4,68 atm" },
      { key: "D", text: "5 atm" },
    ],
    answer: "C",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=293$ K, $T_2=343$ K." },
      {
        text: "$P_2 = 4 \\cdot 343/293 \\approx 4{,}68$ atm.",
        note: "Shuning uchun dezodorant va boshqa aerozol balonlarni issiq joyda yoki quyosh tagida qoldirish xavfli.",
      },
    ],
    mistakes: [
      { when: "A", text: "Harorat nisbati teskari olindi." },
      { when: "B", text: "Yopiq balonda harorat ortsa, bosim ham ortadi." },
    ],
  },
  {
    slug: "mol-022",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Dam olish markazidagi shishiriladigan qayiqning hajmi 200 litr, bosimi 1,1 atm edi. Qayiqqa odamlar chiqib og'irlik tushishi bilan hajm 180 litrga qisqardi (harorat o'zgarmaydi). Yangi bosimni toping.",
    options: [
      { key: "A", text: "1,22 atm" },
      { key: "B", text: "0,99 atm" },
      { key: "C", text: "1,1 atm" },
      { key: "D", text: "1,5 atm" },
    ],
    answer: "A",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1{,}1 \\cdot 200/180 \\approx 1{,}22$ atm.",
        note: "Shuning uchun ko'p odam chiqqan shishiriladigan qayiq yoki matras 'qattiqlashganday' tuyuladi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Hajmlar nisbati teskari olindi." },
      { when: "C", text: "Hajm kamaysa, bosim ortadi — o'zgarmay qolmaydi." },
    ],
  },
  {
    slug: "mol-023",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Yerda berk yopilgan yupqa plastik suv shishasi ichida 500 ml havo 1 atm bosimda bor edi. Samolyot parvozida salon ichidagi bosim 0,8 atm ga tushganda, shisha devori yupqa va cho'ziluvchan bo'lgani uchun uning ichidagi havo hajmi qanday bo'ladi (harorat o'zgarmaydi)?",
    options: [
      { key: "A", text: "400 ml" },
      { key: "B", text: "500 ml" },
      { key: "C", text: "550 ml" },
      { key: "D", text: "625 ml" },
    ],
    answer: "D",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$V_2 = P_1 V_1 / P_2 = 1 \\cdot 500/0{,}8 = 625$ ml.",
        note: "Shuning uchun parvozdan keyin suv shishasi biroz 'shishgan' holda ko'rinadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish o'rniga ko'paytirdingiz." },
      { when: "B", text: "Bosim pasaysa, hajm o'zgarmay qolmaydi — kengayadi." },
    ],
  },
  {
    slug: "mol-024",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Konserva ishlab chiqarishda bankaga 0,7 atm bosimli havo bilan 300 ml hajmda yopiladi. Agar shu havo normal atmosfera bosimida (1 atm) bo'lganda qancha hajmni egallagan bo'lardi?",
    options: [
      { key: "A", text: "428,6 ml" },
      { key: "B", text: "210 ml" },
      { key: "C", text: "300 ml" },
      { key: "D", text: "350 ml" },
    ],
    answer: "B",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$V_2 = P_1 V_1 / P_2 = 0{,}7 \\cdot 300/1 = 210$ ml.",
        note: "Shuning uchun konserva bankasini ochganda xirillagan ovoz eshitiladi — bosim tenglashadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish yo'nalishi teskari olindi." },
      { when: "C", text: "Bosim oshsa, hajm kamayishi kerak." },
    ],
  },
  {
    slug: "mol-025",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Yong'in o'chirgich balonidagi bosim 25°C da 12 atm. Agar balon yozda qizigan mashina bagajida 65°C gacha isib ketsa (hajm o'zgarmaydi), bosim qancha bo'ladi?",
    options: [
      { key: "A", text: "13,61 atm" },
      { key: "B", text: "10,58 atm" },
      { key: "C", text: "12 atm" },
      { key: "D", text: "15 atm" },
    ],
    answer: "A",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=298$ K, $T_2=338$ K." },
      {
        text: "$P_2 = 12 \\cdot 338/298 \\approx 13{,}61$ atm.",
        note: "Shuning uchun yong'in o'chirgichni issiq mashina ichida yoki quyosh tagida qoldirish tavsiya etilmaydi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Harorat nisbati teskari olindi." },
      { when: "C", text: "Yopiq balonda harorat ortsa, bosim ham ortadi." },
    ],
  },
  {
    slug: "mol-026",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Dazmonning bug' kamerasidagi havo harorati 20°C dan 120°C ga ko'tarilganda (hajm o'zgarmaydi), bosim necha marta ortadi?",
    options: [
      { key: "A", text: "2 marta" },
      { key: "B", text: "0,75 marta" },
      { key: "C", text: "1,34 marta" },
      { key: "D", text: "6 marta" },
    ],
    answer: "C",
    solution: [
      { text: "Gey-Lyussak qonuni: $P_2/P_1 = T_2/T_1$, $T_1=293$ K, $T_2=393$ K." },
      {
        text: "$P_2/P_1 = 393/293 \\approx 1{,}34$ marta.",
        note: "Shuning uchun dazmon ishlayotganda bug' teshigidan bosim bilan bug' chiqadi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Nisbat teskari olindi." },
      { when: "D", text: "Selsiy darajalarini to'g'ridan-to'g'ri nisbatladingiz — Kelvin shkalasiga o'tish kerak." },
    ],
  },
  {
    slug: "mol-027",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Konditsioner kompressorida 400 sm³ freon gazi 1,5 atm bosimda bor edi. Kompressor uni 100 sm³ gacha siqadi (harorat o'zgarmaydi deb hisoblang). Bosimni toping.",
    options: [
      { key: "A", text: "0,38 atm" },
      { key: "B", text: "6 atm" },
      { key: "C", text: "1,5 atm" },
      { key: "D", text: "4 atm" },
    ],
    answer: "B",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1{,}5 \\cdot 400/100 = 6$ atm.",
        note: "Konditsionerlar aynan shu tamoyil — gazni siqib sovutish — asosida ishlaydi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "C", text: "Hajm kamaysa, bosim ortadi." },
    ],
  },
  {
    slug: "mol-028",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Iliq garajda (22°C) saqlangan mashina shinasidagi bosim 2,2 atm edi. Mashinani sovuq ko'chaga (−8°C) chiqarganda (hajm o'zgarmaydi), bosim qancha bo'ladi?",
    options: [
      { key: "A", text: "2,45 atm" },
      { key: "B", text: "2,2 atm" },
      { key: "C", text: "1,7 atm" },
      { key: "D", text: "1,98 atm" },
    ],
    answer: "D",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=295$ K, $T_2=265$ K." },
      {
        text: "$P_2 = 2{,}2 \\cdot 265/295 \\approx 1{,}98$ atm.",
        note: "Shuning uchun qishda sovuqqa chiqqan mashinada shina bosimi pasayib ketadi — tekshirib turing.",
      },
    ],
    mistakes: [
      { when: "A", text: "Harorat nisbati teskari olindi." },
      { when: "B", text: "Harorat pasaysa, yopiq hajmda bosim ham pasayadi." },
    ],
  },
  {
    slug: "mol-029",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Shifoxona kislorod ballonida harorat 15°C bo'lganda bosim 150 atm edi. Ballon issiqroq xonaga olib o'tilib, harorat 25°C ga ko'tarilganda (hajm o'zgarmaydi), bosim qancha bo'ladi?",
    options: [
      { key: "A", text: "145 atm" },
      { key: "B", text: "150 atm" },
      { key: "C", text: "155,2 atm" },
      { key: "D", text: "160 atm" },
    ],
    answer: "C",
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=288$ K, $T_2=298$ K." },
      {
        text: "$P_2 = 150 \\cdot 298/288 \\approx 155{,}2$ atm.",
        note: "Shifoxona kislorod ballonlari doimiy harorat nazoratida saqlanadi — bosim o'zgarishi xavfli bo'lishi mumkin.",
      },
    ],
    mistakes: [
      { when: "A", text: "Harorat nisbati teskari olindi." },
      { when: "B", text: "Harorat ortsa, yopiq ballonda bosim ham ortadi." },
    ],
  },
  {
    slug: "mol-030",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Yangi yil bayrami uchun geliy bilan to'ldirilgan sharning yer sathidagi hajmi 2 litr, bosimi 1 atm. Shar yuqoriga ko'tarilib, tashqi bosim 0,6 atm bo'lgan balandlikka yetganda, shar hajmi qancha bo'ladi (harorat o'zgarmaydi deb hisoblang)?",
    options: [
      { key: "A", text: "3,33 litr" },
      { key: "B", text: "0,3 litr" },
      { key: "C", text: "2 litr" },
      { key: "D", text: "2,6 litr" },
    ],
    answer: "A",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$V_2 = P_1 V_1 / P_2 = 1 \\cdot 2/0{,}6 \\approx 3{,}33$ litr.",
        note: "Shuning uchun baland ko'tarilgan sharlar ba'zan portlab ketadi — tashqi bosim pasayishi bilan.",
      },
    ],
    mistakes: [
      { when: "B", text: "Bo'lish yo'nalishi teskari olindi." },
      { when: "C", text: "Tashqi bosim kamaysa, shar hajmi kengayishi kerak." },
    ],
  },
  {
    slug: "mol-031",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Avtomobil xavfsizlik yostig'ida hodisa paytida hosil bo'lgan gaz dastlab 0,5 litr hajmda 10 atm bosimda bo'ladi. Yostiq to'liq ochilib hajmi 50 litrga yetganda, bosim qancha bo'ladi (harorat o'zgarmaydi deb hisoblang)?",
    options: [
      { key: "A", text: "1000 atm" },
      { key: "B", text: "0,1 atm" },
      { key: "C", text: "10 atm" },
      { key: "D", text: "1 atm" },
    ],
    answer: "B",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 10 \\cdot 0{,}5/50 = 0{,}1$ atm.",
        note: "Xavfsizlik yostig'i soniyaning bir ulushida shishishi aynan shu tez gaz kengayishi tufayli.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish yo'nalishi teskari olindi." },
      { when: "C", text: "Hajm juda ortsa, bosim juda kamayadi." },
    ],
  },
  {
    slug: "mol-032",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Sport musobaqalarida ishlatiladigan signal balonchasida 150 ml siqilgan gaz 8 atm bosimda bor edi. Signal berilganda gaz tashqi muhitga chiqib, 1200 ml hajmni egallaydi (harorat o'zgarmaydi deb hisoblang). Oxirgi bosimni toping.",
    options: [
      { key: "A", text: "64 atm" },
      { key: "B", text: "8 atm" },
      { key: "C", text: "2 atm" },
      { key: "D", text: "1 atm" },
    ],
    answer: "D",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 8 \\cdot 150/1200 = 1$ atm.",
        note: "Shuning uchun signal balonchasi siqilgan holatda juda qattiq, ishlatilgach esa bo'shashadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish yo'nalishi teskari olindi." },
      { when: "B", text: "Hajm ortsa, bosim kamayishi kerak." },
    ],
  },
  {
    slug: "mol-033",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "HARD",
    text: "Stakan ostida yonib turgan sham atrofidagi havoni 80°C gacha isitgan, stakan ichidagi havo hajmi 500 ml edi. Sham o'chirilgach, bosim atmosfera bosimiga teng saqlangan holda harorat 20°C ga tushganda, havo hajmi qancha bo'ladi?",
    options: [
      { key: "A", text: "415 ml" },
      { key: "B", text: "602,4 ml" },
      { key: "C", text: "500 ml" },
      { key: "D", text: "380 ml" },
    ],
    answer: "A",
    solution: [
      { text: "Bosim o'zgarmas (Sharl qonuni): $V_1/T_1 = V_2/T_2$, $T_1=353$ K, $T_2=293$ K." },
      {
        text: "$V_2 = 500 \\cdot 293/353 \\approx 415$ ml.",
        note: "Bu mashhur fizika tajribasi — sham o'chgach stakan ostiga suv so'rilib kirishini ko'rsatadi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Harorat nisbati teskari olindi." },
      { when: "C", text: "Bosim o'zgarmas bo'lsa ham, harorat pasayganda hajm kamayadi (Sharl qonuni)." },
    ],
  },
  {
    slug: "mol-034",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "32 g tabiiy gaz (metan, CH₄) necha mol ekanligini toping. (Metanning molyar massasi 16 g/mol.)",
    options: [
      { key: "A", text: "0,5 mol" },
      { key: "B", text: "512 mol" },
      { key: "C", text: "2 mol" },
      { key: "D", text: "32 mol" },
    ],
    answer: "C",
    solution: [
      { text: "$\\nu = m/M$." },
      {
        text: "$\\nu = 32/16 = 2$ mol.",
        note: "Tabiiy gaz (metan) O'zbekiston uylarida asosiy yoqilg'i turi hisoblanadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish yo'nalishi teskari olindi." },
      { when: "B", text: "Bo'lish o'rniga ko'paytirdingiz." },
    ],
  },
  {
    slug: "mol-035",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "88 g uglerod (IV) oksidi (CO₂) gazida necha mol modda bor? (CO₂ molyar massasi 44 g/mol.)",
    options: [
      { key: "A", text: "0,5 mol" },
      { key: "B", text: "2 mol" },
      { key: "C", text: "3872 mol" },
      { key: "D", text: "88 mol" },
    ],
    answer: "B",
    solution: [
      { text: "$\\nu = m/M$." },
      {
        text: "$\\nu = 88/44 = 2$ mol.",
        note: "Gazlangan ichimliklardagi 'pufakchalar' aynan shu CO₂ gazi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Bo'lish yo'nalishi teskari olindi." },
      { when: "C", text: "Bo'lish o'rniga ko'paytirdingiz." },
    ],
  },
  {
    slug: "mol-036",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "3 mol vodorod gazi (H₂) necha gramm ekanligini toping. (Vodorodning molyar massasi 2 g/mol.)",
    options: [
      { key: "A", text: "0,67 g" },
      { key: "B", text: "5 g" },
      { key: "C", text: "1,5 g" },
      { key: "D", text: "6 g" },
    ],
    answer: "D",
    solution: [
      { text: "$m = \\nu M$." },
      {
        text: "$m = 3 \\cdot 2 = 6$ g.",
        note: "Vodorod eng yengil gaz — shuning uchun vodorodli sharlar osongina ko'tariladi.",
      },
    ],
    mistakes: [{ when: "A", text: "Ko'paytirish o'rniga bo'lib yubordingiz." }],
  },
  {
    slug: "mol-037",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Agar gaz harorati Kelvin shkalasida 2 marta oshirilsa (hajm o'zgarmasa), molekulalarning o'rtacha kinetik energiyasi necha marta ortadi?",
    options: [
      { key: "A", text: "2 marta" },
      { key: "B", text: "4 marta" },
      { key: "C", text: "1,41 marta" },
      { key: "D", text: "O'zgarmaydi" },
    ],
    answer: "A",
    solution: [
      { text: "O'rtacha kinetik energiya $E = \\dfrac{3}{2}kT$, ya'ni $E$ to'g'ridan-to'g'ri $T$ ga proporsional." },
      {
        text: "Harorat 2 marta oshsa, $E$ ham aynan 2 marta ortadi.",
        note: "Shuning uchun issiqlik gaz molekulalarining harakat energiyasini haroratga chiziqli bog'liq holda oshiradi.",
      },
    ],
    mistakes: [
      { when: "B", text: "Kinetik energiya tezlikning kvadratiga emas, to'g'ridan-to'g'ri haroratga proporsional: $E \\sim T$." },
      { when: "C", text: "Bu tezlikning necha marta ortishi ($v \\sim \\sqrt{T}$), energiyaning emas." },
    ],
  },
  {
    slug: "mol-038",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "MEDIUM",
    text: "Poyezd vagonining konditsioner tizimida 600 sm³ gaz 1,2 atm bosimda bor edi. Kompressor uni 150 sm³ gacha siqadi (harorat o'zgarmaydi). Bosimni toping.",
    options: [
      { key: "A", text: "0,3 atm" },
      { key: "B", text: "4,8 atm" },
      { key: "C", text: "1,2 atm" },
      { key: "D", text: "4 atm" },
    ],
    answer: "B",
    solution: [
      { text: "$P_1 V_1 = P_2 V_2$." },
      {
        text: "$P_2 = 1{,}2 \\cdot 600/150 = 4{,}8$ atm.",
        note: "Poyezd konditsionerlari ham xuddi shu siqish-kengaytirish printsipi asosida ishlaydi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Hajmlar nisbati teskari olindi." },
      { when: "C", text: "Hajm kamaysa, bosim ortadi." },
    ],
  },
  {
    slug: "mol-039",
    topicCode: "2.1",
    type: "Y1",
    difficulty: "EASY",
    text: "Qoraqalpog'iston, Nukus shahrida qishning sovuq kunlaridan birida harorat −25°C ni tashkil etdi. Bu Kelvin shkalasida necha gradusga teng?",
    options: [
      { key: "A", text: "298 K" },
      { key: "B", text: "273 K" },
      { key: "C", text: "−298 K" },
      { key: "D", text: "248 K" },
    ],
    answer: "D",
    solution: [
      { text: "$T = t + 273$." },
      {
        text: "$T = -25 + 273 = 248$ K.",
        note: "Qoraqalpog'istonda qishki haroratlar ba'zan −25°C dan ham pastga tushadi.",
      },
    ],
    mistakes: [
      { when: "A", text: "Manfiy ishorani hisobga olmadingiz." },
      { when: "B", text: "Haroratning o'zini (−25°C) hisobga olmadingiz." },
    ],
  },
  {
    slug: "mol-040",
    topicCode: "2.1",
    type: "O",
    difficulty: "HARD",
    text: "Avtomobil shinasining hajmi 15 litr. Qishda 7°C da shinani pompalaganda bosim 2 atm bo'ldi. Yozda harorat 37°C ga ko'tarilganda (hajm o'zgarmaydi), yangi bosimni va bosim o'zgarishini (foizda) toping.",
    options: [
      { key: "a", label: "Yangi bosim", unit: "atm" },
      { key: "b", label: "Bosim ortishi", unit: "%" },
    ],
    answer: { values: { a: 2.21, b: 10.7 }, tolerance: 0.05 },
    solution: [
      { text: "$P_1/T_1 = P_2/T_2$, $T_1=280$ K, $T_2=310$ K." },
      { text: "$P_2 = 2 \\cdot 310/280 \\approx 2{,}21$ atm." },
      {
        text: "Ortish: $(P_2-P_1)/P_1 \\cdot 100\\% = (2{,}21-2)/2 \\cdot 100\\% \\approx 10{,}7\\%$.",
        note: "Shuning uchun mavsum almashganda shina bosimini qayta tekshirish tavsiya etiladi.",
      },
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
