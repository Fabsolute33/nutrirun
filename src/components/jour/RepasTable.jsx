import { Coffee, Apple, ChefHat, Cookie, Moon } from "lucide-react";
import { MEAL_CONFIG, MEAL_TARGETS, C } from "../../constants";
import { getMealColor } from "../../utils";

const ICONS = { Coffee, Apple, ChefHat, Cookie, Moon };

export default function RepasTable({ seanceType, repas, onChange }) {
  const targets = seanceType ? MEAL_TARGETS[seanceType] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 70px 80px",
        gap: 8,
        padding: "4px 8px",
        fontSize: 11,
        fontWeight: 700,
        color: C.faint,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        <span>Repas</span>
        <span style={{ textAlign: "right" }}>Cible</span>
        <span style={{ textAlign: "right" }}>Réel</span>
      </div>

      {MEAL_CONFIG.map((meal, i) => {
        const Icon = ICONS[meal.icon];
        const target = targets ? targets[i] : null;
        const val = Number(repas[i]) || 0;
        const valColor = repas[i] ? getMealColor(val, target) : C.text;

        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 70px 80px",
              gap: 8,
              alignItems: "center",
              padding: "8px",
              borderRadius: 10,
              background: i % 2 === 0 ? C.bg : C.surface,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {Icon && <Icon size={15} color={C.muted} />}
              <span style={{ fontSize: 13, color: C.text }}>{meal.name}</span>
            </div>
            <div style={{ textAlign: "right", fontSize: 13, color: C.faint }}>
              {target ? `${target}` : "—"}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <input
                type="number"
                min="0"
                max="3000"
                placeholder="—"
                value={repas[i]}
                onChange={e => onChange(i, e.target.value)}
                style={{
                  width: 68,
                  textAlign: "right",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "4px 8px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: valColor,
                  background: C.surface,
                  outline: "none",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
