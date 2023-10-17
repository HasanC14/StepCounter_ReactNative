import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Accelerometer } from "expo-sensors";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

const App = () => {
  const [stepCount, setStepCount] = useState(0);
  const [goal, setGoal] = useState(null);
  const [congratulate, setCongratulate] = useState(false);

  useEffect(() => {
    let subscription;
    if (goal !== null) {
      subscription = Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const deltaX = Math.abs(x);
        const deltaY = Math.abs(y);
        const deltaZ = Math.abs(z);

        if (deltaX + deltaY + deltaZ > 3) {
          setStepCount((prevCount) => {
            if (prevCount + 1 === parseInt(goal, 10)) {
              setCongratulate(true);
            }
            return prevCount + 1;
          });
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [goal]);

  const handleSetGoal = () => {
    if (goal && goal > 0) {
      setStepCount(0);
      setCongratulate(false);
    }
  };

  const color = congratulate ? "green" : "red";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {goal === null && (
        <>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 20,
              paddingHorizontal: 10,
            }}
            placeholder="Enter step goal"
            keyboardType="numeric"
            onEndEditing={(event) => setGoal(event.nativeEvent.text)}
          />
          <Button title="Set Goal" onPress={handleSetGoal} />
        </>
      )}
      <Svg height="200" width="200">
        <Circle
          cx="100"
          cy="100"
          r="90"
          stroke="black"
          strokeWidth="2"
          fill={color}
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          fontSize="40"
          fill="white"
          dy="10"
        >
          {stepCount}
        </SvgText>
      </Svg>
      {congratulate && (
        <Text style={{ fontSize: 20, marginTop: 10, color: "green" }}>
          Congratulations! You've reached your goal of {goal} steps!
        </Text>
      )}
    </View>
  );
};

export default App;
