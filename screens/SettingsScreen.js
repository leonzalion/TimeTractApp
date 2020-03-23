import React, {useContext} from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import logoutUser from '../controllers/user/logout';
import UserContext from '../contexts/User';
import useRescueTime from '../hooks/useRescueTime';
import Colors from "../constants/Colors";
import {createStackNavigator} from "@react-navigation/stack";
import {SERVER_URL} from "../constants/Server";
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

const DISCONNECT_RESCUETIME_MUTATION = gql`
  mutation {
    disconnectUserFromRescueTime
  }
`;

const LEAVE_GROUP_MUTATION = gql`
  mutation($input: LeaveGroupInput!) {
    leaveGroup(input: $input)
  }
`;

const Stack = createStackNavigator();

export default function SettingsScreen({ navigation }) {
  const {user, setUser} = useContext(UserContext);
  const connectRescueTime = useRescueTime();
  const [disconnectRescueTime] = useMutation(DISCONNECT_RESCUETIME_MUTATION);
  const [leaveGroup] = useMutation(LEAVE_GROUP_MUTATION);

  const list = [
    {
      hidden: !user.accessToken,
      title: 'Disconnect RescueTime',
      titleStyle: styles.destructive,
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        const result = await disconnectRescueTime();
        setUser({...user, accessToken: result.disconnectUserFromRescueTime});
        alert('Successfully disconnected from RescueTime.');
      }
    },
    {
      hidden: !!user.accessToken,
      title: 'Connect RescueTime',
      titleStyle: {color: Colors.productive},
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        await connectRescueTime();
      }
    },
    {
      hidden: !user.groups.length,
      title: 'Leave Group',
      titleStyle: styles.destructive,
      chevron: false,
      bottomDivider: true,
      onPress: async () => {
        const result = await leaveGroup({variables: {input: {groupId: user.groups[0].id}}});
        setUser({...user, groups: result.leaveGroup});
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