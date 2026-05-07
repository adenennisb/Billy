"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicSignBlock({
  token,
  clientName,
}: {
  token: string;
  clientName: string;
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(clientName);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111";

    let drawing = false;
    let last: { x: number; y: number } | null = null;

    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      last = pos(e);
      c.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drawing || !last) return;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      setHasDrawn(true);
    };
    const up = () => {
      drawing = false;
      last = null;
    };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
    c.addEventListener("pointerleave", up);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", up);
      c.removeEventListener("pointerleave", up);
    };
  }, []);

  function clearCanvas() {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setHasDrawn(false);
  }

  async function submit() {
    if (!name.trim() || !agreed) return;
    setBusy(true);
    setError(null);
    const signatureData = hasDrawn ? canvasRef.current?.toDataURL("image/png") : null;
    const res = await fetch(`/api/c/${token}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, signatureData }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded border p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full legal name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium">Draw your signature (optional)</label>
          <button type="button" onClick={clearCanvas} className="text-xs underline">
            Clear
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          className="w-full rounded border bg-white touch-none"
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span>
          I agree to use electronic signatures and acknowledge that my typed name and/or drawn
          mark above is my legal signature.
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={submit}
        disabled={busy || !name.trim() || !agreed}
        className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {busy ? "Signing…" : "Sign contract"}
      </button>
    </div>
  );
}
