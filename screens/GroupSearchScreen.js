import React, {useState, useContext, useEffect} from 'react';
import {SearchBar, Icon, ListItem} from 'react-native-elements';
import {Text, View, FlatList} from 'react-native';
import UserContext from "../contexts/User";
import gql from 'graphql-tag';
import {useQuery, useMutation} from "@apollo/react-hooks";
import Loading from "../components/Loading";

const GROUP_QUERY = gql`
  query($filter: String) {
    groups(filter: $filter) {
      id
      name
      blurb
    }
  }
`;

const JOIN_GROUP_MUTATION = gql`
  mutation($input: JoinGroupInput!) {
    joinGroup(input: $input) {
      name
      blurb
    }
  }
`;

function GroupList(props) {
  const navigation = props.navigation;
  const {user, setUser} = useContext(UserContext);
  const [joinGroup] = useMutation(JOIN_GROUP_MUTATION);
  const {loading, error, data} = useQuery(GROUP_QUERY, {
    variables: {
      filter: props.searchValue
    }
  });

  async function join(groupId) {
    console.log(groupId);
    const {data} = await joinGroup({
      variables: {input: {groupId}}
    });
    console.log(data);
    const {joinGroup: group} = data;
    const groups = [...user.groups,
      {
        id: groupId,
        name: group.name,
        blurb: group.blurb
      }
    ];
    setUser({...user, groups});
    navigation.replace('Group', {groupId});
  }

  function renderGroup(group, index) {
    return (
      <ListItem
        key={index}
        title={group.name}
        titleStyle={{fontWeight: 'bold'}}
        subtitle={group.blurb}
        chevron={true}
        bottomDivider={true}
        onPress={() => join(group.id)}
      />
    );
  }

  if (loading) return <Loading />;
  return (
    <FlatList
      data={data.groups}
      renderItem={({item, index}) => renderGroup(item, index)}
      keyExtractor={(item, index) => '' + index}
    />
  );
}

export default function GroupScreen({ navigation }) {
  const [searchValue, setSearchValue] = useState('');

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
      <GroupList searchValue={searchValue} navigation={navigation}/>
    </View>
  );
}



