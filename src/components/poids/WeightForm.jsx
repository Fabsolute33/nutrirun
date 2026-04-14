import { useState } from "react";
import { Plus, Scale } from "lucide-react";
import { C } from "../../constants";
import { todayKey } from "../../utils";

export default function WeightForm({ onAdd }) {
  const [poids, setPoids] = useState("");
  const [date, setDate] = useState(todayKey());
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const ok = onAdd(date, poids);
    if (ok) {
      setPoids("");
      setError("");
    } else {
      setError("Valeur invalide (30–300 kg)");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "8px 12px",
        }}>
          <Scale size={16} color={C.muted} />
          <input
            type="number"
            placeholder="Poids (kg)"
            value={poids}
            onChange={e => { setPoids(e.target.value); setError(""); }}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 15,
              fontWeight: 700,
              color: C.text,
              outline: "none",
              width: "100%",
            }}
          />
        </div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "8px 10px",
            fontSize: 13,
            color: C.text,
            background: C.bg,
            outline: "none",
          }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "10px",
          borderRadius: 12,
          border: "none",
          background: C.accent,
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <Plus size={16} />
        Enregistrer
      </button>
      {error && <div style={{ fontSize: 12, color: C.danger, textAlign: "center" }}>{error}</div>}
    </div>
  );
}
