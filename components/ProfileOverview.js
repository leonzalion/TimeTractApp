import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native';
import ProfileCards from './ProfileCards';
import UserAvatar from './UserAvatar';
import ActiveUserAvatar from './ActiveUserAvatar';

export default function ProfileOverview({user, activeUser, ...props}) {
  const cards = <ProfileCards user={user} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={props.refreshControl}
      >
        {activeUser ?
          <ActiveUserAvatar /> :
          <UserAvatar user={user} />
        }
        <Text style={styles.userName}>@{user.username}</Text>
        {props.children}
        {user.rescueTimeData ? cards : null}
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
