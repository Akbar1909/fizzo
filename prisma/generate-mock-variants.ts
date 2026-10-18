import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Question } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// Mirrors the full-mock composition in src/lib/mock.ts. Duplicated (not
// imported) because that file is marked "server-only" and can't be loaded
// outside the Next.js server runtime.
const SECTION_COMPOSITION: { sectionCode: string; y1: number; o: number }[] = [
  { sectionCode: "1", y1: 10, o: 3 },
  { sectionCode: "2", y1: 5, o: 2 },
  { sectionCode: "3", y1: 10, o: 2 },
  { sectionCode: "4", y1: 3, o: 2 },
  { sectionCode: "5", y1: 3, o: 1 },
];
const LOGIC_Y1_COUNT = 1;
const MATCHING_Y2_COUNT = 3;

const TARGET_VARIANT_COUNT = 10;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type QuestionWithSection = Question & { topic: { section: { code: string } } };

function pickVariantQuestionIds(allPublished: QuestionWithSection[]): string[] {
  const used = new Set<string>();
  const y1: Question[] = [];
  const y2: Question[] = [];
  const o: Question[] = [];

  function takeFrom(pool: Question[], count: number): Question[] {
    const available = shuffle(pool.filter((q) => !used.has(q.id)));
    const taken = available.slice(0, count);
    for (const q of taken) used.add(q.id);
    return taken;
  }

  for (const comp of SECTION_COMPOSITION) {
    const sectionQuestions = allPublished.filter((q) => q.topic.section.code === comp.sectionCode);
    y1.push(...takeFrom(sectionQuestions.filter((q) => q.type === "Y1"), comp.y1));
    o.push(...takeFrom(sectionQuestions.filter((q) => q.type === "O"), comp.o));
  }
  y1.push(...takeFrom(allPublished.filter((q) => q.type === "Y1"), LOGIC_Y1_COUNT));
  y2.push(...takeFrom(allPublished.filter((q) => q.type === "Y2"), MATCHING_Y2_COUNT));

  return [...y1, ...y2, ...o].map((q) => q.id);
}

async function main() {
  const existingCount = await db.mockVariant.count();
  if (existingCount >= TARGET_VARIANT_COUNT) {
    console.log(`Already have ${existingCount} variants (target ${TARGET_VARIANT_COUNT}) — nothing to do.`);
    return;
  }

  const allPublished = await db.question.findMany({
    where: { isPublished: true },
    include: { topic: { include: { section: true } } },
  });

  for (let number = existingCount + 1; number <= TARGET_VARIANT_COUNT; number++) {
    const questionIds = pickVariantQuestionIds(allPublished);
    await db.mockVariant.create({ data: { number, questionIds } });
    console.log(`Created variant ${number} (${questionIds.length} savol).`);
  }
}

main()
  .then(() => db.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await db.$disconnect();
    process.exit(1);
  });
