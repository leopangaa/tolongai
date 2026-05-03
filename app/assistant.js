import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { detectIntent } from "../logic/intentDetector";

export default function AssistantScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Ask me about floods, typhoons, earthquakes, injuries, or evacuation."
  );

  function handleAsk() {
    if (!question.trim()) {
      setAnswer("Please type a disaster-related question.");
      return;
    }

    const response = detectIntent(question);
    setAnswer(response);
  }

  return (
    <ScrollView contentContainerClassName="flex-grow bg-darkbg p-5">
      <Text className="text-white text-lg font-bold mb-3">
        Your Question
      </Text>

      <TextInput
        className="bg-neutral-800 text-white p-4 rounded-xl min-h-[110px] mb-4"
        placeholder="Example: What should I do during a flood?"
        placeholderTextColor="#777"
        value={question}
        onChangeText={setQuestion}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity
        className="bg-emergency p-4 rounded-xl mb-5"
        onPress={handleAsk}
      >
        <Text className="text-white text-center font-bold text-base">
          Ask Offline Assistant
        </Text>
      </TouchableOpacity>

      <View className="bg-card p-5 rounded-xl">
        <Text className="text-white font-bold text-lg mb-2">
          Answer:
        </Text>

        <Text className="text-gray-300 text-base leading-6">
          {answer}
        </Text>
      </View>
    </ScrollView>
  );
}