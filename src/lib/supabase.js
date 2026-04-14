import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://ranklzwincjnvtabqfmj.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbmtsendpbmNqbnZ0YWJxZm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzA5MDYsImV4cCI6MjA5MTcwNjkwNn0.S4oMIB80M10y1kwMzoWB4XH81S93HHOtaDpwP1ZBolE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
