import { Flame, Watch, Info } from "lucide-react";
import { C } from "../../constants";
import { calcBMR, calcMaintenance } from "../../utils";

export default function BMRCard({ profil }) {
  const bmr = calcBMR(profil);
  const maintenance = bmr ? calcMaintenance(profil, 0) : null;

  if (!bmr) return (
    <div style={{
      padding: 16,
      background: C.warnBg,
      border: `1px solid ${C.warnBorder}`,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <Info size={18} color={C.warn} />
      <span style={{ fontSize: 13, color: C.warn }}>
        Complétez votre profil pour calculer votre BMR.
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {/* BMR */}
        <div style={{
          flex: 1,
          background: C.accentBg,
          border: `1px solid ${C.accentBorder}`,
          borderRadius: 14,
          padding: "14px 12px",
          textAlign: "center",
        }}>
          <Flame size={18} color={C.accent} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 24, fontWeight: 900, color: C.accent }}>{Math.round(bmr)}</div>
          <div style={{ fontSize: 11, color: C.muted }}>BMR (kcal)</div>
        </div>

        {/* Maintenance de base */}
        <div style={{
          flex: 1,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "14px 12px",
          textAlign: "center",
        }}>
          <Watch size={18} color={C.muted} style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 24, fontWeight: 900, color: C.text }}>{maintenance}</div>
          <div style={{ fontSize: 11, color: C.muted }}>Maintenance base</div>
        </div>
      </div>

      <div style={{
        padding: "10px 12px",
        background: C.bg,
        borderRadius: 12,
        fontSize: 12,
        color: C.muted,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <Info size={14} color={C.faint} style={{ marginTop: 1, flexShrink: 0 }} />
        <span>
          Maintenance = BMR × 1.375 + kcal montre. Le kcal de la montre s'ajoute chaque jour depuis l'onglet Jour.
        </span>
      </div>
    </div>
  );
}
