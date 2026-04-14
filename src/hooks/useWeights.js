import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useWeights(userId) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("weights")
      .select("date, value")
      .eq("user_id", userId)
      .order("date")
      .then(({ data }) => {
        if (data) setEntries(data);
      });
  }, [userId]);

  const addEntry = async (date, value) => {
    const val = parseFloat(String(value).replace(",", "."));
    if (!val || isNaN(val) || val < 30 || val > 300) return false;

    const { error } = await supabase
      .from("weights")
      .upsert({ user_id: userId, date, value: val });

    if (!error) {
      const updated = entries.filter(e => e.date !== date);
      updated.push({ date, value: val });
      updated.sort((a, b) => a.date.localeCompare(b.date));
      setEntries(updated);
      return true;
    }
    return false;
  };

  const deleteEntry = async (date) => {
    await supabase
      .from("weights")
      .delete()
      .eq("user_id", userId)
      .eq("date", date);
    setEntries(prev => prev.filter(e => e.date !== date));
  };

  return { entries, addEntry, deleteEntry };
}
