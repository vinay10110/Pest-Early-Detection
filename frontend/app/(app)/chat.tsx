import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

interface ChatMessage {
  text: string;
  isUser: boolean;
  image?: string;
  visionAnalysis?: {
    detected_pest: string;
    confidence: number;
    severity: string;
  };
}

export default function Chat() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    saveChatHistory();
  }, [chatHistory]);

  const loadChatHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("chatHistory");
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatHistory = async () => {
    try {
      if (chatHistory.length > 0) {
        await AsyncStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      }
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem("chatHistory");
      setChatHistory([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0].base64) {
        setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch {
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0].base64) {
        setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Image", "Choose how you want to add an image", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImageFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) {
      Alert.alert("Error", "Please enter a message or select an image");
      return;
    }

    setIsLoading(true);

    const userMessage: ChatMessage = {
      text: message,
      isUser: true,
      image: selectedImage || undefined,
    };
    setChatHistory((prev) => [...prev, userMessage]);

    const currentMessage = message;
    const currentImage = selectedImage;
    setMessage("");
    setSelectedImage(null);

    try {
      const payload = {
        message: currentMessage,
        image: currentImage ? currentImage.split(",")[1] : undefined,
        language: i18n.language || "en",
      };

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.response) {
        setChatHistory((prev) => [
          ...prev,
          {
            text: data.response,
            isUser: false,
            visionAnalysis: data.vision_analysis,
          },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            text: `Error: ${data.error || "Failed to get response"}`,
            isUser: false,
          },
        ]);
      }
    } catch (error: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          text: `Error: ${error.message}`,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Chat Area */}
      <ScrollView style={styles.chatContainer}>
        {chatHistory.map((chat, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              chat.isUser ? styles.userMessage : styles.agentMessage,
            ]}
          >
            {chat.image && (
              <Image source={{ uri: chat.image }} style={styles.messageImage} />
            )}
            {chat.text ? (
              <Text
                style={[
                  styles.messageText,
                  !chat.isUser && styles.agentMessageText,
                ]}
              >
                {chat.text}
              </Text>
            ) : null}
            {chat.visionAnalysis && (
              <View style={styles.visionAnalysis}>
                <Text style={styles.visionTitle}>🔍 Analysis Results:</Text>
                <Text style={styles.visionText}>
                  Pest: {chat.visionAnalysis.detected_pest}
                </Text>
                <Text style={styles.visionText}>
                  Confidence:{" "}
                  {(chat.visionAnalysis.confidence * 100).toFixed(1)}%
                </Text>
                <Text style={styles.visionText}>
                  Severity: {chat.visionAnalysis.severity}
                </Text>
              </View>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Image preview */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={removeSelectedImage}
          >
            <MaterialIcons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Section */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Pressable style={styles.iconButton} onPress={showImagePicker}>
            <MaterialIcons name="image" size={24} color="#007AFF" />
          </Pressable>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={t("typeMessage")}
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f6fa" },


  chatContainer: { flex: 1, padding: 12 },

  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    elevation: 3,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
  },
  agentMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    shadowColor: "#aaa",
  },
  messageText: { color: "#fff", fontSize: 16 },
  agentMessageText: { color: "#333" },

  messageImage: {
    width: 200,
    height: 140,
    borderRadius: 12,
    marginBottom: 6,
  },

  visionAnalysis: {
    backgroundColor: "#eef6ff",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  visionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  visionText: { fontSize: 13, color: "#333", marginBottom: 2 },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loadingText: { marginLeft: 8, color: "#666", fontSize: 14 },

  imagePreviewContainer: { position: "relative", margin: 10, alignSelf: "center" },
  imagePreview: { width: 110, height: 110, borderRadius: 12 },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff3b30",
    borderRadius: 15,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  inputWrapper: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  iconButton: { padding: 6 },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { backgroundColor: "#ccc" },
});
