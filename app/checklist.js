import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import { generateChecklist } from "../logic/checklistGenerator";

export default function checklist() {
  const [disasterType, setDisasterType] = useState("flood");
  const [familySize, setFamilySize] = useState("1");

  const [hasBaby, setHasBaby] = useState(false);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [needsMedicine, setNeedsMedicine] = useState(false);

  const [checklist, setChecklist] = useState([]);

  function handleGenerate() {
    const size = parseInt(familySize) || 1;

    const result = generateChecklist({
      disasterType,
      familySize: size,
      hasBaby,
      hasElderly,
      hasPets,
      needsMedicine,
    });

    setChecklist(result);
  }

  return (
    <ScrollView contentContainerClassName="flex-grow bg-darkbg p-5">
      <Text className="text-white text-2xl font-bold mb-2">
        Emergency Checklist Generator
      </Text>

      <Text className="text-gray-300 mb-6">
        Create a simple offline checklist based on your situation.
      </Text>

      <Text className="text-white font-bold mb-2">Disaster Type</Text>

      <View className="flex-row mb-5">
        <DisasterButton
          label="Flood"
          value="flood"
          selected={disasterType}
          onPress={setDisasterType}
        />
        <DisasterButton
          label="Typhoon"
          value="typhoon"
          selected={disasterType}
          onPress={setDisasterType}
        />
        <DisasterButton
          label="Earthquake"
          value="earthquake"
          selected={disasterType}
          onPress={setDisasterType}
        />
      </View>

      <Text className="text-white font-bold mb-2">Family Size</Text>

      <TextInput
        className="bg-neutral-800 text-white p-4 rounded-xl mb-5"
        keyboardType="numeric"
        value={familySize}
        onChangeText={setFamilySize}
        placeholder="Example: 4"
        placeholderTextColor="#777"
      />

      <Text className="text-white font-bold mb-3">Special Needs</Text>

      <ToggleOption
        label="Has baby"
        value={hasBaby}
        onPress={() => setHasBaby(!hasBaby)}
      />

      <ToggleOption
        label="Has elderly"
        value={hasElderly}
        onPress={() => setHasElderly(!hasElderly)}
      />

      <ToggleOption
        label="Has pets"
        value={hasPets}
        onPress={() => setHasPets(!hasPets)}
      />

      <ToggleOption
        label="Needs medicine"
        value={needsMedicine}
        onPress={() => setNeedsMedicine(!needsMedicine)}
      />

      <TouchableOpacity
        className="bg-emergency p-5 rounded-xl mt-5 mb-6"
        onPress={handleGenerate}
      >
        <Text className="text-white text-center font-bold text-lg">
          Generate Checklist
        </Text>
      </TouchableOpacity>

      {checklist.length > 0 && (
        <View className="bg-card p-5 rounded-xl">
          <Text className="text-white text-xl font-bold mb-4">
            Your Emergency Checklist
          </Text>

          {checklist.map((item, index) => (
            <Text key={index} className="text-gray-200 text-base mb-2">
              ✓ {item}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function DisasterButton({ label, value, selected, onPress }) {
  const isSelected = selected === value;

  return (
    <TouchableOpacity
      className={`flex-1 p-3 rounded-xl mr-2 ${
        isSelected ? "bg-emergency" : "bg-neutral-800"
      }`}
      onPress={() => onPress(value)}
    >
      <Text className="text-white text-center font-bold">{label}</Text>
    </TouchableOpacity>
  );
}

function ToggleOption({ label, value, onPress }) {
  return (
    <TouchableOpacity
      className={`p-4 rounded-xl mb-3 ${
        value ? "bg-emergency" : "bg-neutral-800"
      }`}
      onPress={onPress}
    >
      <Text className="text-white font-bold">
        {value ? "✓ " : ""}{label}
      </Text>
    </TouchableOpacity>
  );
}