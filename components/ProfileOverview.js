import React, {useState, useEffect} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import ProfileCards from './ProfileCards';
import UserAvatar from './UserAvatar';
import ActiveUserAvatar from './ActiveUserAvatar';
import useRescueTimeData from "../hooks/useRescueTimeData";

export default function ProfileOverview({user, activeUser, ...props}) {
  const [refreshing, setRefreshing] = useState(false);
  const [rescueTimeData, setRescueTimeData] = useState(null);
  const getUserRescueTimeData = useRescueTimeData();

  async function getData() {
    setRefreshing(true);
    setRescueTimeData(await getUserRescueTimeData(user));
    setRefreshing(false);
  }
  useEffect(() => {
    (async() => getData())();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getData} />
        }
      >
        {activeUser ?
          <ActiveUserAvatar /> :
          <UserAvatar user={user} />
        }
        <Text style={styles.userName}>@{user.username}</Text>
        {props.children}
        {activeUser && user.accessToken || !activeUser && user.rescueTimeData ?
          <ProfileCards
            rescueTimeData={rescueTimeData}
          /> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  contentContainer: {
    flex: 0,
    alignItems: 'center',
    padding: 15,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 5
  },
});
