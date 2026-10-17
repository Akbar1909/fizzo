import { FreeFallScene } from "@/components/animations/free-fall-scene";

export default function AnimatsiyaNamunaPage() {
  return (
    <main className="page" style={{ maxWidth: 420, margin: "0 auto", padding: "32px 20px" }}>
      <h1 className="display" style={{ fontSize: 20, marginBottom: 16 }}>
        Erkin tushish — namuna
      </h1>
      <FreeFallScene />
    </main>
  );
}
