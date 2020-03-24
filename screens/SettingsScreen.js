import React, {useContext} from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import logoutUser from '../controllers/user/logout';
import UserContext from '../contexts/User';
import useRescueTime from '../hooks/useRescueTime';
import Colors from "../constants/Colors";
import {createStackNavigator} from "@react-navigation/stack";
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

const DISCONNECT_RESCUETIME_MUTATION = gql`
  mutation {
    disconnectUserFromRescueTime
  }
`;

const LEAVE_GROUP_MUTATION = gql`
  mutation($input: LeaveGroupInput!) {
    leaveGroup(input: $input) {
      id
    }
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
        setUser({...user, accessToken: '', rescueTimeData: undefined});
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
        console.log(user.groups[0].id);
        const {data} = await leaveGroup({variables: {input: {groupId: user.groups[0].id}}});
        const groups = user.groups.filter(group => group.id !== data.leaveGroup.id);
        setUser({...user, groups});
        navigation.replace('Account');
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