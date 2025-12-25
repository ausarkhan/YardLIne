import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function run() {
      // ✅ IMPORTANT for web magic links: consume tokens from the URL hash
      try {
        // This will set the session if the URL contains tokens
        // (safe to call even when there are no tokens)
        // @ts-ignore
        if (supabase.auth.getSessionFromUrl) {
          // @ts-ignore
          await supabase.auth.getSessionFromUrl({ storeSession: true });
        }
      } catch (e) {
        // ignore
      }

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

  const signIn = async () => {
    if (!email) return Alert.alert("Enter your campus email");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) Alert.alert(error.message);
    else Alert.alert("Check your email", "We sent you a login code.");
  };

  if (!ready) return null;

  return hasSession ? (
    <Redirect href="/(tabs)" />
  ) : (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 12 }}>
        YardLine
      </Text>
      <Text style={{ color: "#666", marginBottom: 24 }}>
        Sign in with your campus email
      </Text>

      <TextInput
        placeholder="you@school.edu"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      <Pressable
        onPress={signIn}
        disabled={loading}
        style={{
          backgroundColor: "#000",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Sending..." : "Send login code"}
        </Text>
      </Pressable>
    </View>
  );
}