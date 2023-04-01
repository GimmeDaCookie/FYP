import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import { auth, database } from "../config/firebase";
import Exercise from "../components/Exercise";
import { collection, addDoc } from "firebase/firestore";

function CreateWorkout() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      // headerLeft: () => (
      //     <TouchableOpacity
      //     onPress={() => navigation.navigate("Calendar")}
      //     style={styles.calendarButton}
      // >
      //     <Entypo name="menu" size={24} color={colors.lightGray} />
      // </TouchableOpacity>
      // ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Log")}
          style={styles.calendarButton}
        >
          <Entypo name="cog" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setWorkoutName("");
      setExercises([{ name: "", sets: [{ weight: "", reps: "" }], note: "" }]);

      return () => {
        console.log("UNMOTINGING!");
        setWorkoutName("");
        setExercises(null);
      };
    }, [])
  );

  const [workoutName, setWorkoutName] = useState("");
  const handleNameChange = (value) => {
    setWorkoutName(value);
  };
  const [exercises, setExercises] = useState([
    { name: "", sets: [{ weight: "", reps: "" }], note: "" },
  ]);

  // Add an exercise to the list
  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: [{ weight: "", reps: "" }], note: "" },
    ]);
  };

  const deleteExercise = (index) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedExercises = [...exercises];
            updatedExercises.splice(index, 1);
            console.log(updatedExercises);
            setExercises(updatedExercises);
          },
        },
      ]
    );
  };

  const updateExerciseState = (name, sets, note, index) => {
    // update the exercises state with the new exercise state
    console.log(name, sets, note, index);
    const newExercises = [...exercises];
    newExercises[index].name = name;
    newExercises[index].sets = sets;
    newExercises[index].note = note;
    setExercises(newExercises);
  };

  // Save the workout to Firebase
  const saveWorkout = async () => {
    try {
      const workoutRef = await addDoc(collection(database, "workouts"), {
        name: workoutName,
        exercises: exercises,
        userId: auth.currentUser.uid, // add user ID to workout document
      });
      console.log("Workout saved with ID: ", workoutRef.id);
    } catch (error) {
      console.error("Error saving workout: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.workoutTitle}>
        <TextInput
          style={styles.nameInput}
          placeholder="Workout Name"
          value={workoutName}
          onChangeText={handleNameChange}
        />
      </View>
      <FlatList
        style={styles.workoutContainer}
        data={exercises}
        renderItem={({ item, index }) => (
          <View>
            <Exercise
              name={item.name}
              sets={item.sets}
              note={item.note}
              index={index}
              handleUpdate={updateExerciseState}
            />
            <Button
              title="Delete Exercise"
              onPress={() => deleteExercise(index)}
              style={styles.saveButton}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <View style={styles.addButtonContainer}>
            <Button
              title="Add Exercise"
              onPress={addExercise}
              style={styles.saveButton}
            />
          </View>
        }
      />

      <View style={styles.saveButtonContainer}>
        <Button
          title="Save Workout"
          onPress={saveWorkout}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
}

export default CreateWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 10,
  },
  saveButtonContainer: {
    justifyContent: "flex-end",
    width: "70%",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  addButtonContainer: {
    justifyContent: "flex-start",
    width: "70%",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  workoutContainer: {
    flex: 1,
  },
  workoutTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    marginRight: 10,
    alignContent: "center",
  },
});
