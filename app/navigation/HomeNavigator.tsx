// app/navigation/HomeNavigator.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Home/ProfileScreen';
import PaymentsScreen from '../screens/Home/PaymentsScreen';
import ElectionScreen from '../screens/Home/ElectionScreen';
import ChatStackNavigator from './ChatStackNavigator';
import EditProfileScreen from '../screens/Home/EditProfileScreen';
import DocumentsStackNavigator from './DocumentsStackNavigator';

const backgroundImage = require('../../assets/bg-login.png');
const Drawer = createDrawerNavigator();

// items du menu principal
const MENU_ITEMS: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
}[] = [
  { label: 'Accueil',    icon: 'home-outline',           route: 'Accueil'    },
  { label: 'Profil',     icon: 'person-outline',         route: 'Profil'     },
  { label: 'Paiements',  icon: 'wallet-outline',         route: 'Paiements'  },
  { label: 'Messagerie', icon: 'chatbubble-outline',     route: 'Messagerie' },
  { label: 'Élections',  icon: 'checkmark-circle-outline', route: 'Élections'  },
  { label: 'Documents',  icon: 'document-text-outline',  route: 'Documents'  },
];

function CustomDrawerContent(props: any) {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setUserName(auth.currentUser?.displayName || 'Membre AJEUTCHIM');
    }, 800);
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <DrawerContentScrollView
        {...props}
        // IMPORTANT: flexGrow:1 pour que le ScrollView prenne tout l'espace et puisse défiler
        contentContainerStyle={[styles.drawerScroll, { flexGrow: 1 }]}
      >
        <View style={styles.drawerHeader}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.avatar}
          />
          {userName === null ? (
            <ActivityIndicator size="small" color="#fff" style={{ marginTop: 8 }} />
          ) : (
            <Text style={styles.drawerUser}>{userName}</Text>
          )}
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map(item => (
            <DrawerItem
              key={item.route}
              label={() => <Text style={styles.menuLabel}>{item.label}</Text>}
              icon={({ color, size }) => (
                <Ionicons name={item.icon} size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate(item.route)}
              style={styles.menuItem}
              inactiveTintColor="#ccc"
              activeTintColor="#fff"
              activeBackgroundColor="rgba(255,255,255,0.1)"
            />
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.menuSection}>
          <DrawerItem
            label={() => <Text style={styles.menuLabel}>Modifier mon profil</Text>}
            icon={({ color, size }) => <Ionicons name="create-outline" size={size} color={color} />}
            onPress={() => props.navigation.navigate('EditProfile')}
            style={styles.menuItem}
            inactiveTintColor="#ccc"
            activeTintColor="#fff"
            activeBackgroundColor="rgba(255,255,255,0.1)"
          />
          <DrawerItem
            label={() => <Text style={[styles.menuLabel, styles.logoutLabel]}>Se déconnecter</Text>}
            icon={({ size }) => <Ionicons name="log-out-outline" size={size} color="#e74c3c" />}
            onPress={() => signOut(auth).then(() => props.navigation.replace('Auth'))}
            style={styles.menuItem}
            inactiveTintColor="#e74c3c"
          />
        </View>
      </DrawerContentScrollView>
    </ImageBackground>
  );
}

export default function HomeNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#020066' },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Accueil"    component={HomeScreen} />
      <Drawer.Screen name="Profil"     component={ProfileScreen} />
      <Drawer.Screen name="Paiements"  component={PaymentsScreen} />
      <Drawer.Screen name="Messagerie" component={ChatStackNavigator} />
      <Drawer.Screen name="Élections"  component={ElectionScreen} />
      <Drawer.Screen name="Documents"  component={DocumentsStackNavigator} />
      <Drawer.Screen name="EditProfile"component={EditProfileScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerScroll: {
    paddingTop: 0,
    paddingBottom: 16,  // un peu d'espace en bas
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  drawerHeader: {
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomColor: '#F4CE23',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#F4CE23',
    marginBottom: 8,
  },
  drawerUser: {
    color: '#F4CE23',
    fontSize: 20,
    fontWeight: '700',
  },
  menuSection: {
    marginTop: 8,
  },
  menuItem: {
    marginVertical: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  menuLabel: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  logoutLabel: {
    color: '#e74c3c',
  },
  divider: {
    height: 1,
    backgroundColor: '#F4CE23',
    marginVertical: 8,
    marginHorizontal: 8,
  },
});
