import { Target, Utensils, TrendingDown, Info } from "lucide-react";
import { C } from "../../constants";
import { fmtDef, getDefColor } from "../../utils";

export default function SummaryCards({ cible, consomme, maintenance, deficit }) {
  const defColor = getDefColor(deficit);
  const defBg = deficit === null ? C.surface : deficit > 0 ? C.accentBg : deficit < 0 ? "#FEF2F2" : C.surface;
  const defBorder = deficit === null ? C.border : deficit > 0 ? C.accentBorder : deficit < 0 ? "#FECACA" : C.border;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* 3 cartes */}
      <div style={{ display: "flex", gap: 8 }}>
        {/* Cible */}
        <div style={{
          flex: 1,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "12px 10px",
          textAlign: "center",
        }}>
          <Target size={16} color={C.muted} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>
            {cible ?? "—"}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Cible kcal</div>
        </div>

        {/* Consommé */}
        <div style={{
          flex: 1,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "12px 10px",
          textAlign: "center",
        }}>
          <Utensils size={16} color={C.muted} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>
            {consomme > 0 ? consomme : "—"}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Consommé</div>
        </div>

        {/* Déficit */}
        <div style={{
          flex: 1,
          background: defBg,
          border: `1px solid ${defBorder}`,
          borderRadius: 14,
          padding: "12px 10px",
          textAlign: "center",
        }}>
          <TrendingDown size={16} color={defColor} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 20, fontWeight: 900, color: defColor }}>
            {deficit !== null ? fmtDef(deficit) : "—"}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>Déficit</div>
        </div>
      </div>

      {/* Légende */}
      <div style={{
        display: "flex",
        gap: 12,
        fontSize: 11,
        color: C.faint,
        justifyContent: "center",
      }}>
        <span style={{ color: C.accent }}>● −XXX = bien (déficit)</span>
        <span style={{ color: C.danger }}>● +XXX = surplus</span>
      </div>

      {/* Ligne maintenance */}
      {maintenance !== null && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          background: C.bg,
          borderRadius: 10,
          fontSize: 12,
          color: C.muted,
        }}>
          <Info size={14} color={C.faint} />
          <span>Maintenance estimée : <strong style={{ color: C.text }}>{maintenance} kcal</strong></span>
        </div>
      )}
    </div>
  );
}
