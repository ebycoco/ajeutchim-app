// app/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import SetPin from '../screens/Auth/SetPin';
import PinLock from '../screens/Auth/PinLock';
import HomeNavigator from './HomeNavigator';
import EditProfileScreen from '../screens/Home/EditProfileScreen';
import LaunchMeetingScreen from '../screens/Home/LaunchMeetingScreen';
import DocumentDetailScreen from '../screens/Home/DocumentDetailScreen';
import DocumentsScreen from '../screens/Home/DocumentsScreen';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SetPin: undefined;
  PinLock: undefined;
  EditProfile: undefined;
  Home: undefined;
  LaunchMeeting: undefined;
  Documents: undefined;
  DocumentDetail: { docId: string; title: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      {/* Écran de connexion sans header */}
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      {/* Écran d’inscription sans header */}
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SetPin"
        component={SetPin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PinLock"
        component={PinLock}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LaunchMeeting"
        component={LaunchMeetingScreen}
        options={{ headerShown: false }}
      /> 
    </Stack.Navigator>
  );
}
