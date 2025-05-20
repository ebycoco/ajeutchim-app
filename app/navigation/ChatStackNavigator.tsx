// app/navigation/ChatStackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../screens/Home/ChatScreen';
import ChatDetailScreen from '../screens/Home/ChatDetailScreen';
import ForumScreen from '../screens/Home/ForumScreen';

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { conversationId: string; conversationName: string };
  Forum: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="Forum" component={ForumScreen} />
    </Stack.Navigator>
  );
}
