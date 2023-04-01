import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
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
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import { auth, database } from "../config/firebase";
import Exercise from "../components/Exercise";
import { collection, addDoc } from "firebase/firestore";

const LogWorkout = ({ route }) => {
  const navigation = useNavigation();
  const [workout, setWorkout] = useState(route.params.workout);

  useFocusEffect(
    useCallback(() => {
      console.log("LOADING WORKOUT!");
      setWorkout(route.params.workout);
      setExercises(route.params.workout.exercises);
      setWorkoutName(route.params.workout.name);

      return () => {
        console.log("UNMOUNTING!");
        setWorkout(null);
        setExercises(null);
        setWorkoutName(null);
      };
    }, [route.params])
  );

  const [workoutName, setWorkoutName] = useState(
    workout == null ? "" : workout.name
  );

  const handleNameChange = (value) => {
    setWorkoutName(value);
  };

  const [exercises, setExercises] = useState(
    workout == null
      ? [{ name: "", sets: [{ weight: "", reps: "" }] }]
      : workout.exercises
  );

  // Add an exercise to the list
  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: [{ weight: "", reps: "" }] },
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
            setExercises(updatedExercises);
          },
        },
      ]
    );
  };

  const updateExerciseState = (name, sets, note, index) => {
    // update the exercises state with the new exercise state
    const newExercises = [...exercises];
    newExercises[index].name = name;
    newExercises[index].sets = sets;
    newExercises[index].note = note;
    setExercises(newExercises);
  };

  // Save the workout to Firebase
  const logWorkout = async () => {
    try {
      const workoutRef = await addDoc(collection(database, 'workout_logs'), {
        workoutName: workoutName,
        exercises: exercises,
        userId: auth.currentUser.uid,
        date: new Date().toISOString(),
      });
  
      console.log('Completed workout saved to Firestore with ID: ', workoutRef.id);
  
      // Loop through the exercises array and add a new document to the "exercise_logs" collection for each exercise
      for (const exercise of exercises) {
        await addDoc(collection(database, 'exercise_logs'), {
          exerciseName: exercise.name,
          sets: exercise.sets,
          userId: auth.currentUser.uid,
          workoutId: workoutRef.id,
          date: new Date().toISOString(),
        });
        console.log('Completed exercise saved to Firestore!');
      }

      navigation.navigate('Log');
    } catch (error) {
      console.error('Error saving completed workout and exercises to Firestore: ', error);
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
      <ScrollView style={styles.workoutContainer}>
        {exercises == null
          ? null
          : exercises.map((exercise, index) => (
              <View>
                <Exercise
                  name={exercise.name}
                  sets={exercise.sets}
                  note={exercise.note}
                  index={index}
                  handleUpdate={updateExerciseState}
                />
                <Button
                  title="Delete Exercise"
                  onPress={() => deleteExercise(index)}
                  style={styles.saveButton}
                />
              </View>
            ))}
        <View style={styles.addButtonContainer}>
          <Button
            title="Add Exercise"
            onPress={addExercise}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
      <View style={styles.saveButtonContainer}>
        <Button
          title="Log Workout"
          onPress={logWorkout}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
};

export default LogWorkout;

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
