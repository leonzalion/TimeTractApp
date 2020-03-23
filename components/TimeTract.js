import React, {useContext, useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EntryScreen from '../screens/EntryScreen';
import AccountScreen from '../screens/AccountScreen';
import {View, Text} from 'react-native';
import {useLazyQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import UserContext from "../contexts/User";
import {USER_FRAGMENT} from "../fragments/user";
import useDidUpdate from "../hooks/useDidUpdate";
import Loading from "./Loading";

const Stack = createStackNavigator();

const USER_QUERY = gql`
  query {
    user {
      ...user
    }
  }
  ${USER_FRAGMENT}
`;

function TimeTract({client}) {
  const {user, setUser} = useContext(UserContext);
  const [isUserSet, setIsUserSet] = useState(false);
  const [getUser, {data, loading, error}] = useLazyQuery(USER_QUERY);

  useEffect(() => {
    getUser();
  }, []);

  useDidUpdate(() => {
    setUser(data.user);
  }, [data]);

  useDidUpdate(() => {
    if (!loading) {
      setIsUserSet(true);
    }
  }, [loading]);

  if (!isUserSet) return <Loading />;
  else return (
    <Stack.Navigator
      initialRouteName={user ? 'Account' : 'Login'}
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Login"
        component={EntryScreen}
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
  );
}

export default TimeTract;
