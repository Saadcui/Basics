import { Ionicons } from "@expo/vector-icons"; // for eye icon
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePasswords } from "../context/PasswordContext";

export default function Dashboard() {
  const { passwords, removePassword } = usePasswords();
  const router = useRouter();
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

  // 🔒 Authentication function
  const authenticate = async (index: number) => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to view password",
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      setVisibleIndex(index);
    } else {
      alert("Authentication failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Passwords</Text>
      {passwords.length === 0 ? (
        <Text style={styles.empty}>No passwords added yet</Text>
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.desc}>{item.description}</Text>

              <View style={styles.passwordRow}>
                <Text style={styles.pass}>
                  {visibleIndex === index ? item.password : "••••••••"}
                </Text>

                <TouchableOpacity onPress={() => authenticate(index)}>
                  <Ionicons
                    name={visibleIndex === index ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removePassword(index)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/add-password");
        }}
      >
        <Text style={styles.buttonText}>Add New Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  desc: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  pass: {
    fontSize: 16,
    color: "gray",
    marginRight: 10,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteBtn: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
