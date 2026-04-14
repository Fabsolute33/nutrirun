import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { C } from "./constants";
import { useAuth } from "./hooks/useAuth";
import { useProfil } from "./hooks/useProfil";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import TabJour from "./components/tabs/TabJour";
import TabSemaine from "./components/tabs/TabSemaine";
import TabPoids from "./components/tabs/TabPoids";
import TabProfil from "./components/tabs/TabProfil";
import LoginScreen from "./components/LoginScreen";

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100dvh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 12,
    }}>
      <HeartPulse size={36} color={C.accent} />
      <div style={{ fontSize: 14, color: C.muted }}>Chargement…</div>
    </div>
  );
}

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [tab, setTab] = useState("jour");
  const { profil, updateProfil } = useProfil(user?.id);

  if (loading) return <LoadingScreen />;
  if (!user)   return <LoginScreen onSignIn={signIn} onSignUp={signUp} />;

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
        <Header profil={profil} onSignOut={signOut} />

        <div style={{ flex: 1, overflowY: "auto", padding: "12px", paddingBottom: 0 }}>
          {tab === "jour"    && <TabJour    profil={profil} userId={user.id} />}
          {tab === "semaine" && <TabSemaine profil={profil} userId={user.id} />}
          {tab === "poids"   && <TabPoids   profil={profil} userId={user.id} />}
          {tab === "profil"  && <TabProfil  profil={profil} onUpdate={updateProfil} />}
          <div style={{ height: 12 }} />
        </div>

        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
