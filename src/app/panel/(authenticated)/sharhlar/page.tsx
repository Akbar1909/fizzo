import { listReviewsForAdmin } from "@/lib/reviews";
import { ReviewsModerationView } from "@/components/admin/reviews-moderation-view";
import { decideReviewAction } from "./actions";

export default async function PanelSharhlarPage() {
  const reviews = await listReviewsForAdmin();

  return (
    <div className="stack">
      <h1 className="display" style={{ fontSize: 22 }}>
        Sharhlar
      </h1>
      <ReviewsModerationView reviews={reviews} decideAction={decideReviewAction} />
    </div>
  );
}
