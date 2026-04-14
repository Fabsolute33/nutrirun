import { Scale, TrendingDown, TrendingUp, Target } from "lucide-react";
import { C } from "../../constants";

export default function WeightStats({ entries, objectif }) {
  if (entries.length === 0) return null;

  const last = entries[entries.length - 1];
  const first = entries[0];
  const evolution = entries.length >= 2 ? (last.value - first.value).toFixed(1) : null;
  const vsObjectif = objectif ? (last.value - objectif).toFixed(1) : null;

  const evoPositive = evolution !== null && Number(evolution) < 0;
  const evoColor = evolution === null ? C.faint : Number(evolution) < 0 ? C.accent : C.danger;
  const EvoIcon = Number(evolution) < 0 ? TrendingDown : TrendingUp;

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {/* Dernier poids */}
      <div style={{
        flex: 1,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "12px 10px",
        textAlign: "center",
      }}>
        <Scale size={16} color={C.muted} style={{ marginBottom: 4 }} />
        <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>{last.value}</div>
        <div style={{ fontSize: 11, color: C.muted }}>Dernier (kg)</div>
      </div>

      {/* Évolution */}
      {evolution !== null && (
        <div style={{
          flex: 1,
          background: evoPositive ? C.accentBg : "#FEF2F2",
          border: `1px solid ${evoPositive ? C.accentBorder : "#FECACA"}`,
          borderRadius: 14,
          padding: "12px 10px",
          textAlign: "center",
        }}>
          <EvoIcon size={16} color={evoColor} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: evoColor }}>
            {Number(evolution) > 0 ? `+${evolution}` : evolution}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Évolution (kg)</div>
        </div>
      )}

      {/* Objectif */}
      {vsObjectif !== null && (
        <div style={{
          flex: 1,
          background: Number(vsObjectif) <= 0 ? C.accentBg : C.surface,
          border: `1px solid ${Number(vsObjectif) <= 0 ? C.accentBorder : C.border}`,
          borderRadius: 14,
          padding: "12px 10px",
          textAlign: "center",
        }}>
          <Target size={16} color={Number(vsObjectif) <= 0 ? C.accent : C.muted} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: Number(vsObjectif) <= 0 ? C.accent : C.danger }}>
            {Number(vsObjectif) > 0 ? `+${vsObjectif}` : vsObjectif}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>vs Objectif</div>
        </div>
      )}
    </div>
  );
}
