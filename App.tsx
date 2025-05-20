// App.tsx
import { LogBox } from 'react-native';
// Masquer les warnings Firestore & Auth non bloquants
LogBox.ignoreLogs([
  /Could not reach Cloud Firestore backend/,
  /WebChannelConnection RPC 'Listen' stream/,
  /@firebase\/auth: Auth \(/,
]);
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';

import { auth } from './app/config/firebase';
import AuthNavigator from './app/navigation/AuthNavigator';
import SetPin from './app/screens/Auth/SetPin';
import PinLock from './app/screens/Auth/PinLock';
import HomeNavigator from './app/navigation/HomeNavigator';
import LaunchMeetingScreen from './app/screens/Home/LaunchMeetingScreen';
import MeetingRoomScreen from './app/screens/Home/MeetingRoomScreen';

export type RootStackParamList = {
  Auth: undefined;
  SetPin: undefined;
  PinLock: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  LaunchMeeting: undefined;
  MeetingRoom: { meetingId: string; topic: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hasPin, setHasPin] = useState<boolean | null>(null);

  // 1. Surveille l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  // 2. Vérifie l'existence d'un PIN
  useEffect(() => {
    if (user) {
      (async () => {
        const pin = await SecureStore.getItemAsync('userPIN');
        setHasPin(!!pin);
      })();
    } else {
      setHasPin(null);
    }
  }, [user]);

  // Affiche un loader tant que Firebase ou PIN n'ont pas répondu
  if (loadingAuth || (user && hasPin === null)) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Détermine le premier écran à afficher
  let initialRoute: keyof RootStackParamList = 'Auth';
  if (user && hasPin === false) initialRoute = 'SetPin';
  else if (user && hasPin === true) initialRoute = 'PinLock';

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="SetPin" component={SetPin} />
        <RootStack.Screen name="PinLock" component={PinLock} />
        <RootStack.Screen name="LaunchMeeting" component={LaunchMeetingScreen} />
        <RootStack.Screen name="MeetingRoom" component={MeetingRoomScreen} />
        <RootStack.Screen name="Home" component={HomeNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
