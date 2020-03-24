import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-native-elements';
import useRescueTime from '../hooks/useRescueTime';
import UserContext from '../contexts/User';
import ProfileOverview from '../components/ProfileOverview';
import {createStackNavigator} from "@react-navigation/stack";
import {RefreshControl} from "react-native";
import useDidUpdate from "../hooks/useDidUpdate";
import useRescueTimeData from "../hooks/useRescueTimeData";

const Stack = createStackNavigator();

export default function ProfileScreen() {
  const {user} = useContext(UserContext);
  const connectRescueTime = useRescueTime();

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
