import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-native-elements';
import connectRescueTime from '../controllers/rescuetime/connect';
import UserContext from '../contexts/User';
import ProfileOverview from '../components/ProfileOverview';
import {createStackNavigator} from "@react-navigation/stack";
import {SERVER_URL} from "../constants/Server";
import fetchHeaders from "../controllers/fetchHeaders";
import {RefreshControl} from "react-native";

const Stack = createStackNavigator();

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  }, [refreshing]);

  async function getData() {
    if (user._id) {
      (async function () {
        const response = await fetch(`${SERVER_URL}/users/rtdata`, {
          method: 'get',
          headers: await fetchHeaders()
        });

        const result = await response.json();
        if (response.status !== 200) {
          console.warn(result);
          alert("Something went wrong. Error object: " + JSON.stringify(result));
          return;
        }

        if (result.last_retrieved !==
          user.rescuetime.last_retrieved) {
          setUser({...user, rescuetime: result});
        }
      })();
    }
  }

  useEffect( () => {
    if (user.rescuetime.access_token) {
      (async () => await getData())();
    }
  }, [user.rescuetime.access_token]);

  const connectRescueTimeButton = (
    <Button
      title={"Connect with RescueTime API"}
      onPress={async () => {
        await connectRescueTime({user, setUser});
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
        {user.rescuetime.access_token ? null : connectRescueTimeButton}
      </ProfileOverview>
    );
  }, [user]);

  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={MyProfileOverview} />
    </Stack.Navigator>
  );

};
