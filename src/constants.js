export const SEANCE_CONFIG = {
  ef_matin:   { label: "EF Matin",      icon: "Sunrise",   color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  ef_soir:    { label: "EF Fin d'apm",  icon: "Sunset",    color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  fractionne: { label: "Fractionné",    icon: "Zap",       color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  longue:     { label: "Longue sortie", icon: "Activity",  color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  repos:      { label: "Repos",         icon: "BedDouble", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
};

export const MEAL_TARGETS = {
  ef_matin:   [450, 150, 600, 200, 700],
  ef_soir:    [450, 200, 650, 300, 500],
  fractionne: [550, 200, 650, 350, 550],
  longue:     [600, 200, 700, 250, 650],
  repos:      [350, 150, 550, 150, 600],
};

export const MEAL_CONFIG = [
  { name: "Petit-déj",      icon: "Coffee"  },
  { name: "Collation mat.", icon: "Apple"   },
  { name: "Déjeuner",       icon: "ChefHat" },
  { name: "Collation 16h",  icon: "Cookie"  },
  { name: "Dîner",          icon: "Moon"    },
];

export const ACTIVITY_MULTIPLIER = 1.375;
export const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export const C = {
  bg:           "#F1F5F9",
  surface:      "#FFFFFF",
  border:       "#E2E8F0",
  text:         "#1E293B",
  muted:        "#64748B",
  faint:        "#94A3B8",
  accent:       "#16A34A",
  accentBg:     "#F0FDF4",
  accentBorder: "#BBF7D0",
  warn:         "#D97706",
  warnBg:       "#FFFBEB",
  warnBorder:   "#FDE68A",
  danger:       "#DC2626",
};
