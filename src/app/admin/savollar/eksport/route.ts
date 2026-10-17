import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { exportQuestionsByTopic } from "@/lib/admin-questions";

export async function GET(request: NextRequest) {
  await requireAdmin();

  const topicId = request.nextUrl.searchParams.get("topicId");
  if (!topicId) {
    return NextResponse.json({ error: "topicId talab qilinadi" }, { status: 400 });
  }

  const questions = await exportQuestionsByTopic(topicId);

  return new NextResponse(JSON.stringify(questions, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${topicId}-savollar.json"`,
    },
  });
}
