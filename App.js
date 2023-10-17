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

  const progress = (stepCount / parseInt(goal, 10)) * 100;
  const color = congratulate ? "green" : "red";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {goal === null && (
        <>
          <TextInput
            style={{
              height: 50,
              width: 200,
              borderColor: "#ccc",
              borderWidth: 2,
              borderRadius: 10,
              marginBottom: 20,
              paddingHorizontal: 10,
              fontSize: 18,
              color: "#333",
            }}
            placeholder="Enter step goal"
            keyboardType="numeric"
            placeholderTextColor="#888"
            onEndEditing={(event) => setGoal(event.nativeEvent.text)}
          />
        </>
      )}
      <Svg height="200" width="200">
        <Circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          strokeWidth="10"
          stroke="#ccc"
        />
        <Circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          strokeWidth="10"
          stroke={color}
          strokeDasharray={`${progress * 5.65} ${565 - progress * 5.65}`}
        />
        <SvgText
          x="50%"
          y="50%"
          textAnchor="middle"
          fontSize="40"
          fill="black"
          dy="10"
        >
          {stepCount}
        </SvgText>
      </Svg>
      {congratulate && (
        <View>
          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              color: "green",
              textAlign: "center",
            }}
          >
            Congratulations!
          </Text>
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              color: "green",
              textAlign: "center",
            }}
          >
            You've reached your goal of {goal} steps!
          </Text>
        </View>
      )}
    </View>
  );
};

export default App;
