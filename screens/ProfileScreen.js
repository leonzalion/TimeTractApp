import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-native-elements';
import useRescueTime from '../hooks/useRescueTime';
import UserContext from '../contexts/User';
import ProfileOverview from '../components/ProfileOverview';
import {createStackNavigator} from "@react-navigation/stack";
import {RefreshControl} from "react-native";
import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import useDidUpdate from "../hooks/useDidUpdate";

const QUERY_RESCUETIME_DATA = gql`
  query {
    user {
      rescueTimeData {
        productiveTime
        distractingTime
        topSites {
          name
          category
          productivity
          timeSpent
        }
      }
    }
  }
`;

const Stack = createStackNavigator();

export default function ProfileScreen() {
  const {user, setUser} = useContext(UserContext);
  const [getRescueTimeData, {data}] = useLazyQuery(QUERY_RESCUETIME_DATA);
  const connectRescueTime = useRescueTime();

  const [refreshing, setRefreshing] = useState(false);

  function getData() {
    if (user.accessToken) {
      getRescueTimeData();
      if (data) {
        console.log(data.user.rescueTimeData);
        setUser({...user, rescueTimeData: data.user.rescueTimeData});
      }
    }
  }

  useDidUpdate(getData, [user.accessToken]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, [refreshing]);

  const connectRescueTimeButton = (
    <Button
      title={"Connect with RescueTime API"}
      onPress={async () => {
        await connectRescueTime();
      }}
      type={"clear"}
    /> 
  );

  const MyProfileOverview = React.useCallback(() => {
    return (
      <ProfileOverview
        user={user}
        activeUser={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {user.accessToken ? null : connectRescueTimeButton}
      </ProfileOverview>
    );
  }, [user]);

  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={MyProfileOverview} />
    </Stack.Navigator>
  );

};
