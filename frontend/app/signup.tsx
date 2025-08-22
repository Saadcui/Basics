import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

export default function SignUp() {
  const router = useRouter();
  const [UserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordMismatch, setConfirmPasswordMismatch] = useState(false);

  // Add a state for API errors
  const [apiError, setApiError] = useState("");

  const handleSignUp = async () => {
    setConfirmPasswordMismatch(false);
    setApiError(""); // reset API error message

    if (!UserName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordMismatch(true);
      return;
    }

    try {
      const response = await fetch("http://192.168.x.y:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: UserName, email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        router.push({ pathname: "/dashboard", params: { userId: data.userId } });
      } else {
        // Show specific error message from backend, if available
        setApiError(data.error || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      setApiError("Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an Account</Text>
      {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
      {confirmPasswordMismatch && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}


      <TextInput
        placeholder="Username"
        value={UserName}
        onChangeText={setUserName}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmPasswordMismatch(false);
        }}
        style={[styles.input, confirmPasswordMismatch && { borderColor: "red" }]}
      />


      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkButton}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "50%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: "#555",
  },
  linkButton: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginBottom: 8,
    alignItems:'center',
    marginLeft: 20,
  },
});
