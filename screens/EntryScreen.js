import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import useDidUpdate from '../hooks/useDidUpdate';
import UserContext from '../contexts/User';
import * as SecureStore from "expo-secure-store";
import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {USER_FRAGMENT} from '../fragments/user';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      user {
        ...user
      }
      token
    }
  }
  ${USER_FRAGMENT}
`;

const REGISTER_MUTATION = gql`
  mutation RegisterMutation($input: RegisterInput!) {
    register(input: $input) {
      user {
        ...user
      }
      token
    }
  }
  ${USER_FRAGMENT}
`;

export default function EntryScreen({ navigation }) {
  const [login] = useMutation(LOGIN_MUTATION);
  const [register] = useMutation(REGISTER_MUTATION);

  const [isError, setError] = useState(true);
  const [isLogin, setLogin] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const [usernameError, setUsernameError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);

  const {setUser} = useContext(UserContext);

  function checkUsername() {if (!username) return 'Username cannot be empty.'}
  function checkPassword() {if (!password) return 'Please enter a password.'}
  function checkError() {setError(usernameError || passwordError)}
  function toggleLogin() {setLogin(!isLogin)}

  function resetErrors() {
    setUsernameError(!!checkUsername());
    setPasswordError(!!checkPassword());
    setUsernameErrorMessage('');
    setPasswordErrorMessage('');
  }

  function checkUsernameError() {
    const message = checkUsername();
    setUsernameError(!!message);
    setUsernameErrorMessage(message);
  }

  function checkPasswordError() {
    const message = checkPassword();
    setPasswordError(!!message);
    setPasswordErrorMessage(message);
  }

  useDidUpdate(checkUsernameError, [username]);
  useDidUpdate(checkPasswordError, [password]);
  useEffect(checkError, [usernameError, passwordError]);
  useEffect(() => setLoginErrorMessage(''), [username, password]);
  useEffect(resetErrors, [isLogin]);

  async function enterUser() {
    setLoading(true);
    const variables = {input: {username, password}};
    const {error, data} = isLogin ?
      await login({variables}) :
      await register({variables});
    setLoading(false);

    if (error) return console.log(`Failed to ${isLogin ? "login" : "register"}.`);

    const {token, user} = isLogin ? data.login : data.register;
    await SecureStore.setItemAsync('jwt', token);
    setUser(user);
    navigation.replace('Account');
  }

  const buttonText = isLogin ? 'Login' : 'Register';
  const switchButtonText = isLogin ?
    "Don't have an account? Click here to register!" :
    "Already have an account? Click here to login!";

  const passwordForm = (
    <Input
      placeholder="Password"
      label="Password"
      errorMessage={passwordErrorMessage}
      autoCapitalize="none"
      onFocus={() => setPasswordErrorMessage('')}
      leftIcon={{type: 'material', name: 'lock'}}
      leftIconContainerStyle={styles.inputLeftIcon}
      secureTextEntry={true}
      containerStyle={styles.inputContainer}
      onChangeText={text => setPassword(text)}
      onBlur={checkPasswordError}
      value={password}
    />
  );

  const usernameForm = (
    <Input
      placeholder="Username"
      label="Username"
      autoCapitalize="none"
      onBlur={checkUsernameError}
      onFocus={() => setUsernameErrorMessage('')}
      errorMessage={usernameErrorMessage}
      leftIcon={{type: 'material', name: 'account-circle'}}
      leftIconContainerStyle={styles.inputLeftIcon}
      containerStyle={styles.inputContainer}
      onChangeText={text => setUsername(text)}
      value={username}
    />
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {usernameForm}
        {passwordForm}
        <Button
          title={buttonText}
          buttonStyle={styles.submitButton}
          onPress={enterUser}
          loading={isLoading}
          disabled={isError}
          titleStyle={{width: '100%'}}
          disabledTitleStyle={{width: '100%'}}
          loadingStyle={{width: '100%'}}
        />
        {!!loginErrorMessage && <Text style={styles.errorMessage}>{loginErrorMessage}</Text>}
        <Button
          title={switchButtonText}
          type="clear"
          onPress = {toggleLogin}
        />
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorMessage: {
    color: '#ff190c',
    fontSize: 12,
    margin: 5
  }
});