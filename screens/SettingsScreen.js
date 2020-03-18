import React, {useContext} from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import logoutUser from '../controllers/user/logout';
import UserContext from '../contexts/User';
import patchUser from '../controllers/user/patch';
import fetchHeaders from "../controllers/fetchHeaders";
import connectRescueTime from '../controllers/rescuetime/connect';
import Colors from "../constants/Colors";
import {createStackNavigator} from "@react-navigation/stack";
import {SERVER_URL} from "../constants/Server";

const Stack = createStackNavigator();

export default function SettingsScreen({ navigation }) {
  const {user, setUser} = useContext(UserContext);

  const list = [
    {
      hidden: !user.rescuetime.access_token,
      title: 'Disconnect RescueTime',
      titleStyle: styles.destructive,
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        await patchUser({
          setUser,
          patches: {
            rescuetime: {
              access_token: ''
            }
          }
        });
        alert('Successfully disconnected from RescueTime.');
      }
    },
    {
      hidden: !!user.rescuetime.access_token,
      title: 'Connect RescueTime',
      titleStyle: {color: Colors.productive},
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        await connectRescueTime({user, setUser});
      }
    },
    {
      hidden: !user.groupId,
      title: 'Leave Group',
      titleStyle: styles.destructive,
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        const response = await fetch(`${SERVER_URL}/groups/${user.groupId}/leave`, {
          method: 'post',
          headers: await fetchHeaders()
        });
        const result = await response.json();
        if (response.status !== 200) {
          alert("Something went wrong. Error object: " + JSON.stringify(result));
          console.warn(result);
          return;
        }
        setUser({...user, ...result});
        alert('Successfully left group.');
      }
    },
    {
      title: 'Logout',
      titleStyle: styles.destructive,
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        await logoutUser();
        navigation.replace('Login');
      }
    }
  ];

  const keyExtractor = (item, index) => index.toString();

  function renderItem({item}) {
    if (!item.hidden) {
      return <ListItem {...item} />
    } else {
      return null;
    }
  }

  function MainPage() {
    return (
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={MainPage} />
    </Stack.Navigator>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  destructive: {
    color: '#ff190c'
  }
});