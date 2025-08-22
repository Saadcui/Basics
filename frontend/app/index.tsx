import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Password Manager</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/signup')}
      >
        <Text style={styles.buttonText}>Go to SignUp</Text>
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
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
