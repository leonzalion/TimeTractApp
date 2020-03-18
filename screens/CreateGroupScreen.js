import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Input, Button} from 'react-native-elements';
import useDidUpdate from '../hooks/useDidUpdate';
import UserContext from '../contexts/User';
import {SERVER_URL} from '../constants/Server';
import fetchHeaders from '../controllers/fetchHeaders';
import patchUser from '../controllers/user/patch';

export default function LoginScreen({ navigation }) {
  const [isError, setError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupNameErrorMessage, setGroupNameErrorMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { user, setUser } = useContext(UserContext);

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

  async function createGroup() {
    setIsLoading(true);
    const response = await fetch(`${SERVER_URL}/groups`, {
      method: 'post',
      headers: await fetchHeaders(),
      body: JSON.stringify({
        name: groupName,
        members: [user._id]
      })
    });
    setIsLoading(false);
    const result = await response.json();
    if (response.status !== 200) {
      setErrorMessage(result.message);
      console.warn(result);
      alert("Something went wrong. Error object: " + JSON.stringify(result));
      return;
    }

    await patchUser({
      setUser,
      patches: {groupId: result._id}
    });
    navigation.replace('Group');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {groupNameForm}
        <Button
          title="Create Group!"
          buttonStyle={styles.submitButton}
          onPress={createGroup}
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