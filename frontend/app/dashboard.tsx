import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PasswordEntry = {
  _id: string;
  description: string;
  password: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const { userId } = useLocalSearchParams(); 

  const fetchPasswords = async () => {
    try {
      if (!userId) {
        alert("No user ID found. Please log in.");
        router.replace("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/passwords?userId=${userId}`);

      if (!res.ok) {
        const error = await res.json();
        alert("Failed to fetch: " + error.message);
        return;
      }

      const data = await res.json();
      setPasswords(data);
    } catch (err) {
      alert("Failed to fetch passwords: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

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

  const deletePassword = async (id: string, index: number) => {
    try {
      const res = await fetch(`http://localhost:5000/passwords/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPasswords((prev) => prev.filter((_, i) => i !== index));
        if (visibleIndex === index) setVisibleIndex(null);
      } else {
        alert("Failed to delete password");
      }
    } catch (err) {
      alert("Error deleting password: " + err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Passwords</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : passwords.length === 0 ? (
        <Text style={styles.empty}>No passwords added yet</Text>
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.desc}>{item.description}</Text>

              <View style={styles.passwordRow}>
                <Text style={styles.pass}>
                  {visibleIndex === index ? item.password : "••••••••"}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (visibleIndex === index) {
                      setVisibleIndex(null);
                    } else {
                      authenticate(index);
                    }
                  }}
                >
                  <Ionicons
                    name={visibleIndex === index ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deletePassword(item._id, index)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.button}
// In your Dashboard component
      onPress={() => router.push({ pathname: '/add-password', params: { userId } })}
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
