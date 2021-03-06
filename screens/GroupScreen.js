import React, {useState, useContext, useEffect} from 'react';
import {View, RefreshControl, StyleSheet, ActivityIndicator, FlatList, Text} from 'react-native';
import {ListItem} from 'react-native-elements';
import formatTime from "../controllers/formatTime";
import Colors from "../constants/Colors";
import useDidUpdate from "../hooks/useDidUpdate";
import gql from 'graphql-tag';
import {useQuery} from "@apollo/react-hooks";
import Loading from "../components/Loading";
import UserContext from "../contexts/User";

const GROUP_QUERY = gql`
  query($id: ID!) {
    group(id: $id) {
      name
      blurb
      description
      members(first: 5) {
        id
        username
        rescueTimeData {
          productiveTime
        }
      }
    } 
  }
`;

export default function GroupScreen({ navigation, route }) {
  const {user} = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const {refetch, loading, data} = useQuery(GROUP_QUERY, {
    variables: {id: user.groups[0].id},
  });

  useDidUpdate(() => {
    data.group.members.sort(function (a, b) {
      let aTime, bTime;
      aTime = a.rescueTimeData ? a.rescueTimeData.productiveTime : -1;
      bTime = b.rescueTimeData ? b.rescueTimeData.productiveTime : -1;
      return bTime - aTime;
    });
    navigation.setOptions({title: data.group.name});
  }, [data]);

  async function refetchGroup() {
    setRefreshing(true);
    await refetch({id: user.groups[0].id});
    setRefreshing(false);
  }

  function renderMember(member, index) {
    let colorStyle = {};
    switch (index) {
      case 0: colorStyle = {color: '#bea802'}; break;
      case 1: colorStyle = {color: '#8e8e9a'}; break;
      case 2: colorStyle = {color: '#9c5221'}; break;
    }
    let avatar;
    if (member.avatarUrl) {
      avatar = {source: {uri: member.avatarUrl}};
    } else {
      avatar = {title: member.username[0].toUpperCase()}
    }

    return (
      <ListItem
        leftAvatar={avatar}
        title={member.username}
        rightTitle={
          member.rescueTimeData ?
            formatTime(member.rescueTimeData.productiveTime) :
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

  if (!data || loading) return <Loading />;

  if (!data.group) {
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
          data={data.group.members}
          renderItem={({item, index}) => renderMember(item, index)}
          keyExtractor={member => member.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetchGroup} />  
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
