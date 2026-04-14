import { C } from "../../constants";

const inputStyle = (C) => ({
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 15,
  color: C.text,
  background: C.bg,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
});

export default function ProfilForm({ profil, onUpdate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Sexe */}
      <div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Sexe</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ val: "m", label: "Homme" }, { val: "f", label: "Femme" }].map(s => (
            <button
              key={s.val}
              onClick={() => onUpdate("sexe", s.val)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 12,
                border: `1.5px solid ${profil.sexe === s.val ? C.accent : C.border}`,
                background: profil.sexe === s.val ? C.accentBg : C.surface,
                color: profil.sexe === s.val ? C.accent : C.muted,
                fontWeight: profil.sexe === s.val ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Âge */}
      <div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Âge</div>
        <input
          type="number"
          min="10"
          max="100"
          placeholder="35"
          value={profil.age}
          onChange={e => onUpdate("age", e.target.value)}
          style={inputStyle(C)}
        />
      </div>

      {/* Taille */}
      <div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Taille (cm)</div>
        <input
          type="number"
          min="100"
          max="250"
          placeholder="185"
          value={profil.taille}
          onChange={e => onUpdate("taille", e.target.value)}
          style={inputStyle(C)}
        />
      </div>

      {/* Poids */}
      <div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Poids (kg)</div>
        <input
          type="number"
          min="30"
          max="300"
          placeholder="105"
          value={profil.poids}
          onChange={e => onUpdate("poids", e.target.value)}
          style={inputStyle(C)}
        />
      </div>
    </div>
  );
}
