import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function AddPassword() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const { userId } = useLocalSearchParams(); // grab userId from URL


  const handleAdd = async () => {
    if (!description || !password || !userId) return;

    try {
      const response = await fetch('https://basics-one-jade.vercel.app/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, password, userId }), 
      });

    if (!response.ok) {
      const error = await response.json();
      alert('Error: ' + error.message);
      return;
    }

    // Clear form & navigate
    setDescription('');
    setPassword('');
    router.push({ pathname: '/dashboard', params: { userId } });
  } catch (err) {
    alert('Failed to add password. ' + err );
  }
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
