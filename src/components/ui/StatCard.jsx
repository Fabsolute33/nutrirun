import { C } from "../../constants";

export default function StatCard({ icon: Icon, value, label, color, bg, border }) {
  const cardColor = color || C.text;
  const cardBg = bg || C.surface;
  const cardBorder = border || C.border;

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 14,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      flex: 1,
    }}>
      {Icon && <Icon size={18} color={cardColor} />}
      <div style={{ fontSize: 22, fontWeight: 900, color: cardColor, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
}
