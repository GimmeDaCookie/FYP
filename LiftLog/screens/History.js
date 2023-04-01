import React, { useState, useLayoutEffect, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, database } from "../config/firebase";
import { useNavigation } from '@react-navigation/native';

const WorkoutHistoryScreen = () => {
  const navigation = useNavigation();  
  const [workouts, setWorkouts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    try {
      const q = query(
        collection(database, 'workout_logs'),
        where('userId', '==', auth.currentUser.uid), // filter by user ID
        orderBy('date', 'desc') // sort by date, most recent first
      );
      const querySnapshot = await getDocs(q);
      const fetchedWorkouts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkouts(fetchedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts from Firestore: ', error);
    }
  };

  useEffect(() => {
    fetchWorkouts().catch((error) => {
      console.error('Unhandled promise rejection: ', error);
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWorkouts().finally(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
      </View>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item: workout }) => (
          <TouchableOpacity
            key={workout.id}
            onPress={() => navigation.navigate("EditWorkout", { workout } )}
            style={styles.listItem}
          >
            <Text style={styles.listItemText}>{workout.workoutName}</Text>
            <Text style={styles.listItemSubtext}>{new Date(workout.date).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

export default WorkoutHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listItemSubtext: {
    fontSize: 12,
    color: '#666',
  },
});


