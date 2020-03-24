import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import useDidUpdate from '../hooks/useDidUpdate';
import UserContext from '../contexts/User';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

const CREATE_GROUP_MUTATION = gql`
  mutation($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
    }
  }
`;

export default function CreateGroupScreen({ navigation }) {
  const [isError, setError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupNameErrorMessage, setGroupNameErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [blurb, setBlurb] = useState('');

  const [createGroup] = useMutation(CREATE_GROUP_MUTATION);

  const {user, setUser} = useContext(UserContext);

  function checkGroupName() {
    setGroupNameErrorMessage(groupName ? '' : 'Group name cannot be empty.');
    setError(!groupName);
  }

  useDidUpdate(checkGroupName, [groupName]);

  const groupNameForm = (
    <Input
      placeholder="Group name"
      label="Group name"
      autoCapitalize="none"
      onBlur={checkGroupName}
      onFocus={() => setGroupNameErrorMessage('')}
      errorMessage={groupNameErrorMessage}
      leftIcon={{type: 'material-community', name: 'account-group'}}
      leftIconContainerStyle={styles.inputLeftIcon}
      containerStyle={styles.inputContainer}
      onChangeText={text => setGroupName(text)}
      value={groupName}
    />
  );

  const blurbForm = (
    <Input
      placeholder="(Short description of group)"
      label="Blurb"
      leftIcon={{type: 'material-icons', name: 'description'}}
      leftIconContainerStyle={styles.inputLeftIcon}
      containerStyle={styles.inputContainer}
      onChangeText={text => setBlurb(text)}
      value={blurb}
    />
  );

  async function create() {
    setIsLoading(true);
    const {data: {createGroup: group}} = await createGroup({
      variables: {
        input: {
          name: groupName,
          description: "",
          blurb
        }
      }
    });
    setIsLoading(false);
    const groups = [
      ...user.groups, {
        id: group.id,
        name: groupName,
        blurb
      }
    ];

    setUser({...user, groups});
    navigation.replace('Group', {groupId: group.id});
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {groupNameForm}
        {blurbForm}
        <Button
          title="Create Group!"
          buttonStyle={styles.submitButton}
          onPress={create}
          loading={isLoading}
          disabled={isError}
          titleStyle={{width: '100%'}}
          disabledTitleStyle={{width: '100%'}}
          loadingStyle={{width: '100%'}}
        />
        {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    margin: 10
  },
  inputLeftIcon: {
    marginLeft: 10,
    marginRight: 10
  },
  submitButton: {
    width: '100%',
    flex: -1,
    flexDirection: 'row'
  },
  errorMessage: {
    color: '#ff190c',
    fontSize: 12,
    margin: 5
  }
});