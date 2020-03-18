import React, {useContext, useState, useEffect} from 'react';
import CreateGroupScreen from "./CreateGroupScreen";
import GroupScreen from "./GroupScreen";
import MemberProfileScreen from './MemberProfileScreen';
import UserContext from '../contexts/User';
import {createStackNavigator} from '@react-navigation/stack';
import {AppLoading} from "expo";
import GroupSearchScreen from './GroupSearchScreen';

const Stack = createStackNavigator();

export default function RankingsScreen() {
  const {user} = useContext(UserContext);
  const [initialScreen, setInitialScreen] = useState('GroupSearch');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      await loadApp();
    })();
  },[user.groupId]);

  async function loadApp() {
    setInitialScreen(user.groupId ? 'Group' : 'GroupSearch');
  }

  const loadingScreen = (
    <AppLoading
      startAsync={loadApp}
      onFinish={() => {
        setIsReady(true);
      }}
      onError={console.warn}
    />
  );

  if (!isReady) return loadingScreen;
  else return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen
        component={CreateGroupScreen}
        name="CreateGroup"
        options={{title: "Create Group"}}
      />
      <Stack.Screen
        name="Group"
        component={GroupScreen}
        options={{
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="GroupSearch"
        component={GroupSearchScreen}
        options={{
          headerLeft: null,
          title: "Groups"
        }}
      />
      <Stack.Screen
        name="MemberProfile"
        component={MemberProfileScreen}
      />
    </Stack.Navigator>
  );
}