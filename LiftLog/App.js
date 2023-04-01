import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { Entypo } from "@expo/vector-icons";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Log from './screens/Home';
import History from './screens/History'
import Calendar from './screens/Calendar';
import CreateWorkout from './screens/CreateWorkout';
import LogWorkout from './screens/LogWorkout';
import colors from './colors';
import EditWorkout from './screens/EditWorkout';
import Stats from './screens/Stats';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

// function MainStack() {
//   return (
//     <Stack.Navigator defaultScreenOptions={Calendar} screenOptions={{
//        title: 'LiftLog',
//        headerStyle: {backgroundColor: colors.primary},
//        headerTintColor: '#fff',
//        }}>
//       <Stack.Screen name='Calendar' component={Calendar}/>
//       <Stack.Screen name='Home' component={Home}/>
//       <Stack.Screen name='Chat' component={Chat}/>
//     </Stack.Navigator>
//   );
// }

function MainStack() {
  return (
    <Tab.Navigator initialRouteName={Log} screenOptions={{
       tabBarStyle: {
        backgroundColor: colors.primary}, 
      tabBarActiveTintColor: 'white',
       headerShown: true,
       headerTitle: 'LIFT LOG',
       headerTitleAlign: 'center',
       headerStyle: {backgroundColor: colors.primary},
       headerTitleStyle: {color: colors.lightGray},
       }}>
      <Tab.Screen name='History' component={History} options={{
        tabBarIcon: ({ color }) => <Entypo name="calendar" size={30} style={{ marginBottom: -3 }} color={color} />,
      }}/>
      <Tab.Screen name='Log' component={Log} options={{
        tabBarIcon: ({ color }) => <Entypo name="plus" size={30} style={{ marginBottom: -3 }} color={color} />,
      }}/>
      <Tab.Screen name='Stats' component={Stats} options={{
        tabBarIcon: ({ color }) => <Entypo name="bar-graph" size={30} style={{ marginBottom: -3 }} color={color} />,
      }}/>
      <Tab.Screen name='CreateWorkout' component={CreateWorkout} options={{
        tabBarButton: () => null,
        tabBarStyle: {height:0}
      }}/>
      <Tab.Screen name='LogWorkout' component={LogWorkout} options={{
        tabBarButton: () => null,
        tabBarStyle: {height:0}
      }}/>
      <Tab.Screen name='EditWorkout' component={EditWorkout} options={{
        tabBarButton: () => null,
        tabBarStyle: {height:0}
      }}/>
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
// unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}