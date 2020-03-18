import React, {useState, useContext, useEffect} from 'react';
import {SearchBar, Icon, ListItem} from 'react-native-elements';
import {View, FlatList} from 'react-native';
import {SERVER_URL} from "../constants/Server";
import fetchHeaders from '../controllers/fetchHeaders';
import UserContext from "../contexts/User";

export default function GroupScreen({ navigation }) {
  const {user, setUser} = useContext(UserContext);
  const [searchValue, setSearchValue] = useState('');
  const [groups, setGroups] = useState([]);

  async function search(text) {
    const response = await fetch(`${SERVER_URL}/groups?search=${text}`, {
      method: 'get',
      headers: await fetchHeaders()
    });
    const result = await response.json();
    if (response.status !== 200) {
      console.warn(result);
      alert("Something went wrong. Error object: " + JSON.stringify(result));
      return;
    }
    setGroups(result);
  }

  useEffect(() => {
    (async () => {
      await search('');
    })();
  }, []);

  async function joinGroup(group) {
    const id = group._id;
    const response = await fetch(`${SERVER_URL}/groups/${id}/join`, {
      method: 'post',
      headers: await fetchHeaders()
    });
    const result = await response.json();
    if (response.status !== 200) {
      alert("Something went wrong. Error object: " + JSON.stringify(result));
      console.warn(result);
      return;
    }
    setUser({...user, ...result});
    navigation.replace('Group');
  }

  function memberCountStr(num) {
    let str = num + ' member';
    if (num !== 1) str += 's';
    return str;
  }

  function renderGroup(group, index) {
    return (
      <ListItem
        key={index}
        title={group.name}
        titleStyle={{fontWeight: 'bold'}}
        subtitle={memberCountStr(group.num_members)}
        chevron={true}
        bottomDivider={true}
        onPress={() => joinGroup(group)}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={{
        flex: -1,
        flexDirection: 'row',
      }}>
        <SearchBar
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Search for groups..."
          value={searchValue}
          onChangeText={async (text) => {
            setSearchValue(text);
            await search(text);
          }}
          platform="default"
          lightTheme={true}
          round={true}
          containerStyle={{
            backgroundColor: '#f2f2f2',
            flexGrow: 1,
            padding: 10
          }}
        />
        <Icon
          name='group-add'
          type='material'
          containerStyle={{
            flex: -1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
          }}
          onPress={
            () => navigation.navigate('CreateGroup')
          }
        />
      </View>
      <FlatList
        data={groups}
        renderItem={({item, index}) => renderGroup(item, index)}
        keyExtractor={(item, index) => ''+index}
      />
    </View>
  );
}



