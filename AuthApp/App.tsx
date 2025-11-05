import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "862426445013-04u4i6p0ch8mcc6o1gvfj6efjg5itohm.apps.googleusercontent.com", 
    redirectUri: "https://auth.expo.dev/yllkafejzullahu/AuthApp", 
  });

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Google Auth successful!", authentication);
      alert("Google login successful!");
    }
  }, [response]);

  const handleSignUp = async () => {
    const newErrors: Errors = {};

    if (!name) newErrors.name = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!confirm) newErrors.confirm = "Please confirm your password.";
    else if (password !== confirm) newErrors.confirm = "Passwords do not match.";
    if (!acceptedTerms) newErrors.terms = "You must accept the Terms & Conditions.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setAcceptedTerms(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22ab54" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Name */}
      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa"
        />
      </View>
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      {/* Email */}
      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
      </View>
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      {/* Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      {/* Confirm Password */}
      <View style={styles.inputRow}>
        <Ionicons name="lock-open-outline" size={20} color="#444" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      </View>
      {errors.confirm && <Text style={styles.error}>{errors.confirm}</Text>}

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Switch
          value={acceptedTerms}
          onValueChange={setAcceptedTerms}
          thumbColor={acceptedTerms ? "#22ab54" : "#ccc"}
        />
        <Text style={styles.termsText}>
          I accept the <Text style={styles.link}>Terms & Conditions</Text>
        </Text>
      </View>
      {errors.terms && <Text style={styles.error}>{errors.terms}</Text>}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Google Sign-In */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#4285F4" }]}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700", color: "#222", textAlign: "center", marginBottom: 24 },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, marginBottom: 12, backgroundColor: "#fff" },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 45, color: "#333" },
  termsContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  termsText: { marginLeft: 8, color: "#333" },
  link: { color: "#22ab54", fontWeight: "600" },
  button: { backgroundColor: "#22ab54", borderRadius: 8, paddingVertical: 12, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  error: { color: "red", fontSize: 12, marginBottom: 8 },
});
