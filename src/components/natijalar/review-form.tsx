"use client";

import { useActionState } from "react";
import { submitReviewAction, type SubmitReviewState } from "@/app/(app)/natijalar/actions";

export function ReviewForm() {
  const [state, formAction] = useActionState<SubmitReviewState, FormData>(submitReviewAction, {
    error: null,
    success: false,
  });

  if (state.success) {
    return (
      <div className="card" style={{ background: "var(--good-soft)", borderColor: "var(--good)" }}>
        <p style={{ fontSize: 14 }}>
          Rahmat! Sharhingiz yuborildi va ko&apos;rib chiqilmoqda. Tasdiqlangandan so&apos;ng bosh sahifada chop etiladi.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card stack-sm">
      <div className="field">
        <label htmlFor="review-text">Fizzo haqida fikringiz</label>
        <textarea
          id="review-text"
          name="text"
          className="input"
          style={{ minHeight: 80 }}
          maxLength={500}
          placeholder="Masalan: Animatsiyalar yordamida ishqalanishni tushunib oldim..."
          required
        />
      </div>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)" }}>
        <input type="checkbox" name="consent" style={{ marginTop: 3 }} required />
        Bu sharhni bosh sahifada ismim bilan (masalan, &quot;Dilnoza A.&quot;) ko&apos;rsatishga roziman.
      </label>
      {state.error && (
        <p role="alert" style={{ color: "var(--bad)", fontSize: 13 }}>
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-primary">
        Sharh yuborish
      </button>
    </form>
  );
}
