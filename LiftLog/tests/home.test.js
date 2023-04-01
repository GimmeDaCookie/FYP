import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../screens/Home';

describe('Home', () => {
  it('displays a list of saved workouts', () => {
    const workouts = [
      { id: 1, name: 'Workout 1', exercises: [] },
      { id: 2, name: 'Workout 2', exercises: [] },
    ];
    const { getByText } = render(<Home savedWorkouts={workouts} />);
    expect(getByText('Workout 1')).toBeDefined();
    expect(getByText('Workout 2')).toBeDefined();
  });

  it('navigates to LogWorkout screen when a workout is clicked', () => {
    const workouts = [
      { id: 1, name: 'Workout 1', exercises: [] },
      { id: 2, name: 'Workout 2', exercises: [] },
    ];
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<Home savedWorkouts={workouts} navigation={navigation} />);
    fireEvent.press(getByText('Workout 1'));
    expect(navigation.navigate).toHaveBeenCalledWith('LogWorkout', { workout: workouts[0] });
  });

  it('navigates to CreateWorkout screen when "Create New Workout" is clicked', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<Home navigation={navigation} />);
    fireEvent.press(getByText('Create New Workout'));
    expect(navigation.navigate).toHaveBeenCalledWith('CreateWorkout');
  });
});
