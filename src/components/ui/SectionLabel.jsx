import { C } from "../../constants";

export default function SectionLabel({ icon: Icon, children }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      color: C.muted,
      marginBottom: 10,
    }}>
      {Icon && <Icon size={14} />}
      {children}
    </div>
  );
}
