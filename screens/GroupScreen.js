import React, {useState, useContext, useEffect} from 'react';
import {View, RefreshControl, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import UserContext from '../contexts/User';
import {SERVER_URL} from '../constants/Server';
import fetchHeaders from '../controllers/fetchHeaders';
import {ListItem} from 'react-native-elements';
import formatTime from "../controllers/formatTime";
import Colors from "../constants/Colors";
import useDidUpdate from "../hooks/useDidUpdate";

export default function GroupScreen({ navigation }) {
  const {user} = useContext(UserContext);
  const [group, setGroup] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    await getGroup();
  }

  useDidUpdate(() => {
    navigation.setOptions({title: group.name});
  }, [group]);

  async function getGroup() {
    setRefreshing(true);
    const response = await fetch(`${SERVER_URL}/groups/${user.groupId}`, {
      method: 'get',
      headers: await fetchHeaders()
    });
    setRefreshing(false);
    const result = await response.json();
    if (response.status !== 200) {
      console.warn(result);
      alert("Something went wrong. Error object: " + JSON.stringify(result));
      return;
    }
    result.members.sort(function(a, b) {
      let a_time, b_time;
      a_time = a.rescuetime.access_token ? a.rescuetime.total_productive_time : -1;
      b_time = b.rescuetime.access_token ? b.rescuetime.total_productive_time : -1;
      return b_time - a_time;
    });
    setGroup(result);
  }

  useEffect(() => {
    (async () => {
      await getGroup();
    })();
  }, []);

  function renderMember(member, index) {
    let colorStyle = {};
    switch (index) {
      case 0: colorStyle = {color: '#bea802'}; break;
      case 1: colorStyle = {color: '#8e8e9a'}; break;
      case 2: colorStyle = {color: '#9c5221'}; break;
    }
    let avatar;
    if (member.avatar_url) {
      avatar = {source: {uri: member.avatar_url}};
    } else {
      avatar = {title: member.username[0].toUpperCase()}
    }

    return (
      <ListItem
        leftAvatar={avatar}
        title={member.username}
        rightTitle={
          member.rescuetime.access_token ?
            formatTime(member.rescuetime.total_productive_time) :
            "---"
        }
        rightTitleStyle={styles.timeText}
        bottomDivider={true}
        chevron={true}
        onPress={() => {
          navigation.push('MemberProfile', {user: member})
        }}
        titleStyle={[styles.username, colorStyle]}
      />
    );
  }

  if (!group) {
    return (
      <View
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      >
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={group.members}
          renderItem={({item, index}) => renderMember(item, index)}
          keyExtractor={member => member._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timeText: {
    color: Colors.productive,
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'right',
    width: 150,
  },
  username: {
    fontWeight: 'bold'
  }
});
