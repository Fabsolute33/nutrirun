import { Sunrise, Sunset, Zap, Activity, BedDouble } from "lucide-react";
import { SEANCE_CONFIG, C } from "../../constants";

const ICONS = { Sunrise, Sunset, Zap, Activity, BedDouble };

export default function SeanceSelector({ value, onChange }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
    }}>
      {Object.entries(SEANCE_CONFIG).map(([key, cfg]) => {
        const Icon = ICONS[cfg.icon];
        const active = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 12,
              border: `1.5px solid ${active ? cfg.border : C.border}`,
              background: active ? cfg.bg : C.surface,
              color: active ? cfg.color : C.muted,
              fontWeight: active ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {Icon && <Icon size={16} />}
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}
