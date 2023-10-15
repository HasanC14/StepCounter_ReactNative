import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Accelerometer } from "expo-sensors";

const App = () => {
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const deltaX = Math.abs(x);
      const deltaY = Math.abs(y);
      const deltaZ = Math.abs(z);

      if (deltaX + deltaY + deltaZ > 3) {
        setStepCount((prevCount) => prevCount + 1);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>Step Count: {stepCount}</Text>
    </View>
  );
};

export default App;
