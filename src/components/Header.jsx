import { LogOut } from "lucide-react";
import { C } from "../constants";
import { calcBMR } from "../utils";

export default function Header({ profil, onSignOut }) {
  const bmr = calcBMR(profil);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/logo.svg" alt="NutriRun" width={36} height={36} style={{ borderRadius: 10 }} />
        <span style={{ fontSize: 18, fontWeight: 900, color: C.text, letterSpacing: "-0.02em" }}>
          NutriRun
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {bmr && (
          <div style={{
            background: C.accentBg,
            border: `1px solid ${C.accentBorder}`,
            borderRadius: 20,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 700,
            color: C.accent,
          }}>
            BMR {Math.round(bmr)} kcal
          </div>
        )}
        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Déconnexion"
            style={{
              background: "none",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "4px 8px",
              cursor: "pointer",
              color: C.faint,
              display: "flex",
              alignItems: "center",
            }}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
