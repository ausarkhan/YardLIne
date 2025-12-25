import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!email) return Alert.alert("Enter your campus email");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) Alert.alert(error.message);
    else Alert.alert("Check your email", "We sent you a login link.");
  }

  return (
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
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          {loading ? "Sending..." : "Send login link"}
        </Text>
      </Pressable>
    </View>
  );
}