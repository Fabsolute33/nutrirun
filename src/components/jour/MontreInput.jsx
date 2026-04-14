import { Watch } from "lucide-react";
import { C } from "../../constants";

export default function MontreInput({ value, onChange }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "10px 14px",
    }}>
      <Watch size={18} color={C.muted} />
      <span style={{ fontSize: 13, color: C.muted, flex: 1 }}>Kcal dépensées (montre)</span>
      <input
        type="number"
        min="0"
        max="2000"
        placeholder="0"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: 70,
          textAlign: "right",
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "4px 8px",
          fontSize: 14,
          fontWeight: 700,
          color: C.text,
          background: C.bg,
          outline: "none",
        }}
      />
      <span style={{ fontSize: 12, color: C.faint }}>kcal</span>
    </div>
  );
}
