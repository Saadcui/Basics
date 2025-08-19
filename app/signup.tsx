import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create an Account</Text>

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
        onChangeText={setConfirmPassword} 
        style={styles.input} 
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/dashboard")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      
      <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
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
}

});
