import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import RankingsScreen from './RankingsScreen';
import TabBarIcon from '../components/TabBarIcon';

const AccountTab = createBottomTabNavigator();

export default function AccountScreen() {
  return (
    <AccountTab.Navigator initialRouteName="Profile">
      <AccountTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />
        }}
      />
      <AccountTab.Screen
        name="Rankings"
        component={RankingsScreen}
        options={{
          title: 'Rankings',
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-podium"/>
        }}
      />
      <AccountTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-settings"/>
        }}
      />
    </AccountTab.Navigator>
  );
}

