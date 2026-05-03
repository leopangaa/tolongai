import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-darkbg px-5 justify-center">
      <TouchableOpacity
        className="bg-emergency p-5 rounded-xl mb-4"
        onPress={() => router.push("assistant")}
      >
        <Text className="text-white text-center text-lg font-bold">
          Ask Disaster Assistant
        </Text>
      </TouchableOpacity>
    </View>
  );
}