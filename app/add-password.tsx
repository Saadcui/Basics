import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePasswords } from "../context/PasswordContext";

export default function AddPassword() {
  const router = useRouter();
  const { addPassword } = usePasswords();
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    if (!description || !password) return;

    addPassword({ description, password });

    setDescription("");
    setPassword("");

    router.push("/dashboard");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a New Password</Text>

      <TextInput 
        placeholder="Enter Description (e.g., Gmail, Facebook)" 
        value={description} 
        onChangeText={setDescription} 
        style={styles.input} 
      />

      <TextInput 
        placeholder="Enter Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>Add Password</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "50%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
