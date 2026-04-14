import { C } from "../../constants";

export default function Card({ children, style }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      padding: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}
