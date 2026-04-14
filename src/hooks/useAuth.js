import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère la session existante au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écoute les changements d'état auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn  = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signUp  = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  return { user, loading, signIn, signUp, signOut };
}
