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
