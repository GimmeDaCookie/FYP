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
    Dimensions,
  } from "react-native";
  import { useNavigation, useFocusEffect } from "@react-navigation/native";
  import colors from "../colors";
  import { Entypo } from "@expo/vector-icons";
  import { auth, database } from "../config/firebase";
  import Exercise from "../components/Exercise";
  import { collection, updateDoc, doc, query, getDocs, where } from "firebase/firestore";
  
  const EditWorkout = ({ route }) => {
    const navigation = useNavigation();
    const [workout, setWorkout] = useState(route.params.workout);
  
    useFocusEffect(
      useCallback(() => {
        console.log("LOADING WORKOUT!");
        setWorkout(route.params.workout);
        setExercises(route.params.workout.exercises);
        setWorkoutName(route.params.workout.workoutName);
  
        return () => {
          console.log("UNMOUNTING!");
          setWorkout(null);
          setExercises(null);
          setWorkoutName(null);
        };
      }, [route.params])
    );
  
    const [workoutName, setWorkoutName] = useState(
      workout == null ? "" : workout.workoutName
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
    const editWorkout = async () => {
      try {
        console.log(workout.id);
        await updateDoc(doc(database, 'workout_logs', workout.id), {
          workoutName: workoutName,
          exercises: exercises,
          userId: auth.currentUser.uid,
        });
    
        console.log('Completed workout saved to Firestore with ID: ', workout.id);
    
        // Loop through the exercises array and update the corresponding document in the "exercise_logs" collection
        for (const exercise of exercises) {
          // Get the exercise ID based on the workout ID and exercise name
          const exerciseQuery = query(collection(database, 'exercise_logs'), 
            where('workoutId', '==', workout.id),
            where('exerciseName', '==', exercise.name),
            where('userId', '==', auth.currentUser.uid));
          const exerciseSnapshot = await getDocs(exerciseQuery);
          const exerciseDoc = exerciseSnapshot.docs[0];
          const exerciseId = exerciseDoc.id;
    
          await updateDoc(doc(database, 'exercise_logs', exerciseId), {
            exerciseName: exercise.name,
            sets: exercise.sets,
            userId: auth.currentUser.uid,
            workoutId: workout.id,
            date: new Date().toISOString(),
          });
          console.log('Completed exercise saved to Firestore!');
        }
    
        navigation.navigate('History');
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
                  <TouchableOpacity
              style={styles.button}
              onPress={() => deleteExercise(index)}
            >
              <Text style={styles.buttonText}>
                Delete Exercise
              </Text>
            </TouchableOpacity>
                </View>
              ))}
          <View style={styles.addButtonContainer}>
          <TouchableOpacity
              style={styles.button}
              onPress={addExercise}
            >
              <Text style={styles.buttonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={editWorkout}
        >
          <Text style={styles.buttonText}>Save Edited Workout</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  export default EditWorkout;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputContainer: {
      marginBottom: 10,
    },
    button: {
      backgroundColor: colors.primary,
      height: 58,
      width: Dimensions.get("window").width - 32,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5,
      alignSelf: "center",
    },
    buttonText: {
      fontWeight: "bold",
      color: "#fff",
      fontSize: 18,
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
  