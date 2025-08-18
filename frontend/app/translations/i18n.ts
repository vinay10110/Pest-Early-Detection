import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const resources = {
  en: {
    translation: {
      chat: "Chat with Agent",
      settings: "Settings",
      profile: "Profile",
      language: "Language",
      chatTitle: "Chat Interface",
      send: "Send",
      typeMessage: "Type your message...",
      selectLanguage: "Select your preferred language",
      languageChanged: "Language Changed",
      languageChangedMessage: "The app language has been updated successfully.",
      languageChangeError: "Failed to change language. Please try again.",
      ok: "OK",
      error: "Error",
      about: "About",
      version: "Version",
      appName: "App Name",
      pestDetectionSystem: "Pest Detection System",
      back: "Back",
      smartFarmingAssistant: "Your smart farming assistant",
    },
  },
  hi: {
    translation: {
      chat: "एजेंट से चैट करें",
      settings: "सेटिंग्स",
      profile: "प्रोफ़ाइल",
      language: "भाषा",
      chatTitle: "चैट इंटरफेस",
      send: "भेजें",
      typeMessage: "अपना संदेश टाइप करें...",
      selectLanguage: "अपनी पसंदीदा भाषा चुनें",
      languageChanged: "भाषा बदली गई",
      languageChangedMessage: "ऐप की भाषा सफलतापूर्वक अपडेट हो गई है।",
      languageChangeError: "भाषा बदलने में विफल। कृपया पुनः प्रयास करें।",
      ok: "ठीक है",
      error: "त्रुटि",
      about: "के बारे में",
      version: "संस्करण",
      appName: "App Name",
      pestDetectionSystem: "कीट पहचान प्रणाली",
      back: "वापस",
      smartFarmingAssistant: "आपका स्मार्ट कृषि सहायक",
    },
  },
  ta: {
    translation: {
      chat: "முகவருடன் அரட்டை",
      settings: "அமைப்புகள்",
      profile: "சுயவிவரம்",
      language: "மொழி",
      chatTitle: "அரட்டை இடைமுகம்",
      send: "அனுப்பு",
      typeMessage: "உங்கள் செய்தியை தட்டச்சு செய்யவும்...",
      selectLanguage: "உங்கள் விரும்பும் மொழியை தேர்வு செய்யவும்",
      languageChanged: "மொழி மாற்றப்பட்டது",
      languageChangedMessage: "அப்ளிகேஷன் மொழி வெற்றிகரமாக அப்டேட் செய்யப்பட்டது।",
      languageChangeError: "மொழி மாற்றுவதில் தேற்றம்। மீண்டும் முயற்சி செய்யவும்।",
      ok: "சரி",
      error: "பிழை",
      about: "பற்றி",
      version: "பதிப்பு",
      appName: "அப்ளிகேஷன் பெயர்",
      pestDetectionSystem: "கீட கண்டறிதல் முறை",
      back: "மீண்டும்",
      smartFarmingAssistant: "உங்கள் ஸ்மார்ட் விவசாய உதவியாளர்",
    },
  },
  te: {
    translation: {
      chat: "ఏజెంట్‌తో చాట్",
      settings: "సెట్టింగ్‌లు",
      profile: "ప్రొఫైల్",
      language: "భాష",
      chatTitle: "చాట్ ఇంటర్‌ఫేస్",
      send: "పంపు",
      typeMessage: "మీ సందేశాన్ని టైప్ చేయండి...",
      selectLanguage: "మీ ఇష్టపడే భాషను ఎంచుకోండి",
      languageChanged: "భాష మార్చింది",
      languageChangedMessage: "అప్‌ భాష విజయవంతంగా అప్‌డేట్ అయ్యింది।",
      languageChangeError: "భాష మార్చడంలో విఫలమైంది। దయచేసి మరలా ప్రయత్నించండి।",
      ok: "సరే",
      error: "తప్పు",
      about: "గురించి",
      version: "వర్షన్",
      appName: "అప్‌ పేరు",
      pestDetectionSystem: "కీడక గుర్తింపు వ్యవస్థ",
      back: "వెనుకకు",
      smartFarmingAssistant: "మీ స్మార్ట్ వ్యవసాయ సహాయకుడు",
    },
  },
};

// Initialize i18n with async language loading
const initI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
    const initialLanguage = savedLanguage || "en";
    
    await i18n.use(initReactI18next).init({
      resources,
      lng: initialLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error("Error initializing i18n:", error);
    // Fallback to default initialization
    await i18n.use(initReactI18next).init({
      resources,
      lng: "en",
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  }
};

// Initialize i18n
initI18n();

export default i18n;
