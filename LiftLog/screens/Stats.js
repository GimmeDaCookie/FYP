import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import colors from "../colors";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";
// import RNPickerSelect from 'react-native-picker-select';
import { LineChart } from "react-native-chart-kit";
import styles from '../styleSheets/styles'
import SelectDropdown from "react-native-select-dropdown";

const Stats = () => {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState([]);
  const [exerciseNames, setExerciseNames] = useState([]);
  const [selectedExerciseName, setSelectedExerciseName] = useState(null); // State to store the selected exercise name
  const [chartData, setChartData] = useState(null); // State to store the chart data

  useLayoutEffect(() => {
    const fetchExercises = async () => {
      try {
        const q = query(
          collection(database, "exercise_logs"),
          where("userId", "==", auth.currentUser.uid), // filter by user ID
          orderBy("exerciseName") // sort by date, most recent first
        );
        const querySnapshot = await getDocs(q);
        const fetchedExercises = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExercises(fetchedExercises);
        const namesSet = new Set(
          fetchedExercises.map((exercise) => exercise.exerciseName)
        );
        const names = Array.from(namesSet);
        setExerciseNames(names);
        console.log(names);
      } catch (error) {
        console.error("Error fetching exercises from Firestore: ", error);
      }
    };

    fetchExercises();
  }, []);

  // Function to generate the chart data for the selected exercise
  const generateChartData = () => {
    const selectedExercises = exercises.filter(
      (exercise) => exercise.exerciseName === selectedExerciseName
    );
    const data = {
      labels: selectedExercises.map((exercise) => {
        const dateObj = new Date(exercise.date);
        return dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }),
      datasets: [
        {
          data: selectedExercises.map((exercise) => {
            let max1RM = 0;

            exercise.sets.forEach((set) => {
              const repsToFailure = Number(set.reps);
              const percentageOf1RM = 100 - repsToFailure * 2.5;
              const decimalValue = percentageOf1RM / 100;
              const estimated1RM = Number(set.weight) / decimalValue;

              if (estimated1RM > max1RM) {
                max1RM = estimated1RM;
              }
            });

            return max1RM;
          }),
        },
      ],
    };
    setChartData(data);
  };

  return (
    <View>
      <View style={styles.container}>
        {/* Exercise selector */}
        {/* <Picker
          selectedValue={selectedExerciseName}
          onValueChange={(itemValue) => setSelectedExerciseName(itemValue)}
          style={{ height: 50, width: Dimensions.get('window').width - 64 }}
        >
          <Picker.Item label="Select Exercise" value={null} />
          {exerciseNames.map((exerciseName) => (
            <Picker.Item
              key={exerciseName}
              label={exerciseName}
              value={exerciseName}
            />
          ))}
        </Picker> */}

        {/* Exercise selector */}
        <SelectDropdown
          data={[null, ...exerciseNames]}
          onSelect={(selectedItem) => setSelectedExerciseName(selectedItem)}
          defaultValue={"Select Exercise"}
          defaultButtonText={"Select Exercise"}
          buttonStyle={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#CCCCCC",
            borderRadius: 8,
            height: 50,
          }}
          buttonTextStyle={{ color: "#000000" }}
          dropdownStyle={{
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#CCCCCC",
            borderRadius: 8,
          }}
          rowStyle={{
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#CCCCCC",
          }}
          rowTextStyle={{ color: "#000000" }}
          dropdownIconPosition="right"
          dropdownIconColor="#000000"
          dropdownIconSize={24}
          style={{ width: "100%" }}
        />

        {/* Chart button */}
        {selectedExerciseName && (
          <TouchableOpacity style={styles.button} onPress={generateChartData}>
            <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
              Draw Chart
            </Text>
          </TouchableOpacity>
        )}

        {/* Chart */}
        {chartData && (
          <View style={{ paddingLeft: 32, backgroundColor: colors.gray }}>
            <Text style={{ color: "#ffffff", textAlign: "center" }}>
              ESTIMATED 1 REP MAX
            </Text>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 64} // subtracting 64 from width to account for left padding and right margin
              height={220}
              yAxisSuffix="kg"
              chartConfig={{
                backgroundColor: "#888888",
                backgroundGradientFrom: "#888888",
                backgroundGradientTo: "#888888",
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              decorator={() => {
                return (
                  <View
                    style={{
                      backgroundColor: "#ffffff",
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: "#888888",
                    }}
                  />
                );
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const statStyles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    width: '80%',
    height: 50,
    justifyContent: 'center',
  },
});

export default Stats;
