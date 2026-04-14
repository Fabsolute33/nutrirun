import { useState } from "react";
import { HeartPulse, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { C } from "../constants";

export default function LoginScreen({ onSignIn, onSignUp }) {
  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Email et mot de passe requis."); return; }
    setLoading(true);
    setError("");
    setSuccess("");

    const fn = mode === "login" ? onSignIn : onSignUp;
    const { error: err } = await fn(email, password);
    setLoading(false);

    if (err) {
      const msgs = {
        "Invalid login credentials":       "Email ou mot de passe incorrect.",
        "User already registered":         "Compte déjà existant. Connecte-toi.",
        "Password should be at least 6 characters": "Mot de passe trop court (6 caractères min).",
        "Email not confirmed":             "Confirme ton email avant de te connecter.",
      };
      setError(msgs[err.message] || err.message);
    } else if (mode === "signup") {
      setSuccess("Compte créé ! Vérifie ton email pour confirmer.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    fontSize: 15,
    color: C.text,
    background: C.bg,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bg,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    }}>
      <div style={{ width: "100%", maxWidth: 390, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Logo */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64, borderRadius: 20,
            background: C.accentBg, border: `1px solid ${C.accentBorder}`,
            marginBottom: 12,
          }}>
            <HeartPulse size={32} color={C.accent} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: "-0.03em" }}>NutriRun</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
            Suivi nutrition & course à pied
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}>
          {/* Toggle login/signup */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.bg, borderRadius: 12, padding: 4 }}>
            {[["login", "Connexion"], ["signup", "Créer un compte"]].map(([val, label]) => (
              <button key={val} onClick={() => { setMode(val); setError(""); setSuccess(""); }} style={{
                flex: 1, padding: "8px 0", borderRadius: 9,
                border: "none",
                background: mode === val ? C.surface : "transparent",
                color: mode === val ? C.text : C.muted,
                fontWeight: mode === val ? 700 : 500,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: mode === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Email */}
            <div style={{ position: "relative" }}>
              <Mail size={16} color={C.faint} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={inputStyle}
              />
            </div>

            {/* Mot de passe */}
            <div style={{ position: "relative" }}>
              <Lock size={16} color={C.faint} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={inputStyle}
              />
            </div>

            {/* Erreur */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: 10,
                background: "#FEF2F2", border: "1px solid #FECACA",
                fontSize: 13, color: C.danger,
              }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Succès */}
            {success && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 12px", borderRadius: 10,
                background: C.accentBg, border: `1px solid ${C.accentBorder}`,
                fontSize: 13, color: C.accent,
              }}>
                <CheckCircle2 size={15} />
                {success}
              </div>
            )}

            {/* Bouton */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px", borderRadius: 12, border: "none",
                background: loading ? C.faint : C.accent,
                color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 4,
              }}
            >
              {loading ? "..." : mode === "login"
                ? <><LogIn size={16} /> Se connecter</>
                : <><UserPlus size={16} /> Créer le compte</>
              }
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, color: C.faint }}>
          Données stockées en toute sécurité · Supabase
        </div>
      </div>
    </div>
  );
}
