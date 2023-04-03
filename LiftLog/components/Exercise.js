import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Exercise = ({ name: initialName, sets: initialSets, note: initialNote, index, handleUpdate}) => {
  const [name, setName] = useState(initialName);
  const [sets, setSets] = useState(initialSets);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    handleUpdate(name, sets, note, index);
  }, [name, sets, note, index]);

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleWeightChange = (value, index) => {
    const newSets = [...sets];
    newSets[index].weight = value;
    setSets(newSets);
  };

  const handleRepsChange = (value, index) => {
    const newSets = [...sets];
    newSets[index].reps = value;
    setSets(newSets);
  };

  const handleNoteChange = (value) => {
    setNote(value);
  };

  const handleAddSet = () => {
    const newSets = [...sets, { weight: '', reps: '' }];
    setSets(newSets);
  };

  const handleDeleteSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.nameInput}
          placeholder="Exercise Name"
          value={name}
          onChangeText={handleNameChange}
        />
      </View>
      {sets.map((set, index) => (
        <View key={index} style={styles.setContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteSet(index)}>
            <Text style={styles.deleteButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.setNumber}>{index + 1}.</Text>
          <TextInput
            style={styles.weightInput}
            placeholder="Weight"
            value={set.weight}
            onChangeText={(value) => handleWeightChange(value, index)}
            keyboardType='numeric'
          />
          <Text style={styles.setLabel}>kg x </Text>
          <TextInput
            style={styles.repsInput}
            placeholder="Reps"
            value={set.reps}
            onChangeText={(value) => handleRepsChange(value, index)}
            keyboardType='numeric'
          />
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddSet}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
        <View style={styles.noteContainer}>
        <TextInput
            style={styles.note}
            placeholder="Note"
            value={note}
            onChangeText={(value) => handleNoteChange(value)}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginRight: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  deleteButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weightInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginRight: 10,
  },
  repsInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  noteContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  note: {
    fontStyle: 'italic',
  },
});

export default Exercise;
