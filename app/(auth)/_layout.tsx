import { Stack } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
