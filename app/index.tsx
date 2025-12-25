import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        // @ts-ignore
        if (supabase.auth.getSessionFromUrl) {
          // @ts-ignore
          await supabase.auth.getSessionFromUrl({ storeSession: true });
        }
      } catch {}
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setReady(true);
    }

    run();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  return hasSession ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}

// npx expo start -c