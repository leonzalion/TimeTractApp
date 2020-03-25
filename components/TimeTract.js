import React, {useContext, useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EntryScreen from '../screens/EntryScreen';
import AccountScreen from '../screens/AccountScreen';
import {useQuery} from '@apollo/react-hooks';
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

function TimeTract() {
  const {user, setUser} = useContext(UserContext);
  const [isUserSet, setIsUserSet] = useState(false);
  const {loading, data} = useQuery(USER_QUERY, {
    onCompleted(data) {
      setUser(data.user);
    }
  });

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
