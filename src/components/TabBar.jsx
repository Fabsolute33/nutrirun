import { CalendarDays, BarChart2, Scale, User } from "lucide-react";
import { C } from "../constants";

const TABS = [
  { id: "jour",    label: "Jour",    icon: CalendarDays },
  { id: "semaine", label: "Semaine", icon: BarChart2    },
  { id: "poids",   label: "Poids",   icon: Scale        },
  { id: "profil",  label: "Profil",  icon: User         },
];

export default function TabBar({ active, onChange }) {
  return (
    <div style={{
      display: "flex",
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      position: "sticky",
      bottom: 0,
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "10px 0 8px",
              border: "none",
              background: "none",
              cursor: "pointer",
              color: isActive ? C.accent : C.faint,
              borderTop: `2px solid ${isActive ? C.accent : "transparent"}`,
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
