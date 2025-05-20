// app/navigation/DocumentsStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DocumentsScreen from '../screens/Home/DocumentsScreen';
import DocumentDetailScreen from '../screens/Home/DocumentDetailScreen';

export type DocumentsStackParamList = {
  DocumentsList: undefined;
  DocumentDetail: { docId: string; title: string };
};

const Stack = createNativeStackNavigator<DocumentsStackParamList>();

export default function DocumentsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DocumentsList"
        component={DocumentsScreen}
        options={{ title: 'Documents' }}
      />
      <Stack.Screen
        name="DocumentDetail"
        component={DocumentDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}
