import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';
import loginUser from './controllers/user/login';
import * as SecureStore from 'expo-secure-store';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import UserContext from './contexts/User';
import {View, Text} from 'react-native';

const Stack = createStackNavigator();

function App() {
  const [isReady, setReady] = useState(false);
  const [initialScreen, setInitialScreen] = useState('Login');
  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      if (user._id) setReady(true);
      else await loadApp();
    })();
  }, [user._id]);

  const loadApp = async () => {
    const username = await SecureStore.getItemAsync('username');
    const password = await SecureStore.getItemAsync('password');

    if (username && password) {
      const response = await loginUser(username, password);
      if (response.status !== 200) {
        setInitialScreen('Login');
        setReady(true);
        return;
      }
      const result = await response.json();
      setUser(result);
      setInitialScreen('Account');
    }
    setReady(true);
  };

  const loadingScreen = (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><Text>Loading...</Text></View>
  );

  if (!isReady) return loadingScreen;
  else return (
    <ActionSheetProvider>
      <UserContext.Provider value={{user, setUser}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialScreen}
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerLeft: null,
              }}
            />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{
                headerLeft: null,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContext.Provider>
    </ActionSheetProvider>
  );
}

export default App;
