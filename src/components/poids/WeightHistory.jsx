import { Trash2 } from "lucide-react";
import { C } from "../../constants";
import { fmtDateFull } from "../../utils";

export default function WeightHistory({ entries, onDelete }) {
  if (entries.length === 0) return (
    <div style={{ textAlign: "center", padding: "16px 0", color: C.faint, fontSize: 13 }}>
      Aucune mesure enregistrée
    </div>
  );

  const reversed = [...entries].reverse();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {reversed.map((entry, i) => {
        const prev = reversed[i + 1];
        const variation = prev ? (entry.value - prev.value).toFixed(1) : null;
        const varColor = variation === null ? C.faint : Number(variation) < 0 ? C.accent : Number(variation) > 0 ? C.danger : C.muted;

        return (
          <div
            key={entry.date}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: C.muted }}>{fmtDateFull(entry.date)}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: C.text }}>{entry.value} kg</span>
                {variation !== null && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: varColor }}>
                    {Number(variation) > 0 ? `+${variation}` : variation} kg
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onDelete(entry.date)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                borderRadius: 8,
                color: C.faint,
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
