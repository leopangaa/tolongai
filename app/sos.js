import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as SMS from "expo-sms";

export default function sos() {
  const [contactNumber, setContactNumber] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyType, setEmergencyType] = useState("Flood");
  const [extraInfo, setExtraInfo] = useState("");

  async function handleSendSOS() {
    const isAvailable = await SMS.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        "SMS Not Available",
        "This device does not support SMS messaging."
      );
      return;
    }

    if (!contactNumber.trim()) {
      Alert.alert("Missing Contact", "Please enter an emergency contact number.");
      return;
    }

    const message = buildSOSMessage({
      name,
      location,
      emergencyType,
      extraInfo,
    });

    await SMS.sendSMSAsync([contactNumber], message);
  }

  return (
    <ScrollView contentContainerClassName="flex-grow bg-darkbg p-5">
      <Text className="text-white text-2xl font-bold mb-2">
        SMS SOS Alert
      </Text>

      <Text className="text-gray-300 mb-6">
        Send an emergency message using SMS. No internet required.
      </Text>

      <Text className="text-white font-bold mb-2">
        Emergency Contact Number
      </Text>
      <TextInput
        className="bg-neutral-800 text-white p-4 rounded-xl mb-4"
        placeholder="Example: 09171234567"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={setContactNumber}
      />

      <Text className="text-white font-bold mb-2">Your Name</Text>
      <TextInput
        className="bg-neutral-800 text-white p-4 rounded-xl mb-4"
        placeholder="Example: Earl"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <Text className="text-white font-bold mb-2">Your Location</Text>
      <TextInput
        className="bg-neutral-800 text-white p-4 rounded-xl mb-4"
        placeholder="Example: Brgy. San Roque, Antipolo"
        placeholderTextColor="#777"
        value={location}
        onChangeText={setLocation}
      />

      <Text className="text-white font-bold mb-3">Emergency Type</Text>

      <View className="flex-row mb-4">
        <EmergencyTypeButton
          label="Flood"
          selected={emergencyType}
          onPress={setEmergencyType}
        />
        <EmergencyTypeButton
          label="Typhoon"
          selected={emergencyType}
          onPress={setEmergencyType}
        />
        <EmergencyTypeButton
          label="Earthquake"
          selected={emergencyType}
          onPress={setEmergencyType}
        />
      </View>

      <Text className="text-white font-bold mb-2">Extra Information</Text>
      <TextInput
        className="bg-neutral-800 text-white p-4 rounded-xl mb-5 min-h-[90px]"
        placeholder="Example: We are trapped on the second floor."
        placeholderTextColor="#777"
        value={extraInfo}
        onChangeText={setExtraInfo}
        multiline
        textAlignVertical="top"
      />

      <View className="bg-card p-4 rounded-xl mb-5">
        <Text className="text-white font-bold mb-2">Message Preview:</Text>
        <Text className="text-gray-300 leading-6">
          {buildSOSMessage({
            name,
            location,
            emergencyType,
            extraInfo,
          })}
        </Text>
      </View>

      <TouchableOpacity
        className="bg-danger p-5 rounded-xl"
        onPress={handleSendSOS}
      >
        <Text className="text-white text-center font-bold text-xl">
          SEND SOS VIA SMS
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-400 text-center mt-4">
        This will open your phone's SMS app for confirmation.
      </Text>
    </ScrollView>
  );
}

function EmergencyTypeButton({ label, selected, onPress }) {
  const isSelected = selected === label;

  return (
    <TouchableOpacity
      className={`flex-1 p-3 rounded-xl mr-2 ${
        isSelected ? "bg-danger" : "bg-neutral-800"
      }`}
      onPress={() => onPress(label)}
    >
      <Text className="text-white text-center font-bold">{label}</Text>
    </TouchableOpacity>
  );
}

function buildSOSMessage({ name, location, emergencyType, extraInfo }) {
  return `SOS EMERGENCY ALERT

Name: ${name || "Not provided"}
Emergency: ${emergencyType}
Location: ${location || "Not provided"}

Details: ${extraInfo || "I need immediate help."}

Please contact local responders or rescue services if possible.`;
}