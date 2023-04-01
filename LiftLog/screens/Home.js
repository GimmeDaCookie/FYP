import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import styles from '../styleSheets/styles';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    where
  } from 'firebase/firestore';

const Home = () => {

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
                    onPress={() => navigation.navigate("Home")}
                    style={styles.calendarButton}
                >
                    <Entypo name="cog" size={24} color={colors.lightGray}  />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Load saved workouts for the current user
  useLayoutEffect(() => {

    const collectionRef = collection(database, 'workouts');
    const q = query(collectionRef, where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, querySnapshot => {
        const workouts = [];
        querySnapshot.forEach(doc => {
          workouts.push({
            userId: doc.data().userId,
            name: doc.data().name,
            exercises: doc.data().exercises,
          });
        });
        setSavedWorkouts(workouts);
        console.log(workouts);
        console.log(auth.currentUser.uid);
      });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Your saved workouts:</Text>
    </View>
    <View style={styles.list}>
      {savedWorkouts.map(workout => (
        <TouchableOpacity
          key={workout.id}
          onPress={() => navigation.navigate("LogWorkout", { workout } )}
          style={styles.listItem}
        >
          <Text style={styles.listItemText}>{workout.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateWorkout")}>
      <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Create New Workout</Text>
      </TouchableOpacity>
    </View>
    <View>
    
    </View>
  </View>
    );
    };

    export default Home;