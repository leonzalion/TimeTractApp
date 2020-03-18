import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import useDidUpdate from '../hooks/useDidUpdate';
import UserContext from '../contexts/User';
import loginUser from '../controllers/user/login';
import * as SecureStore from "expo-secure-store";
import fetchHeaders from "../controllers/fetchHeaders";
import {SERVER_URL} from '../constants/Server';

export default function LoginScreen({ navigation }) {
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

  async function registerUser(username, password) {
    const response = await fetch(`${SERVER_URL}/users`, {
      method: 'POST',
      headers: await fetchHeaders(),
      body: JSON.stringify({username, password})
    });

    if (response.status === 200) {
      await SecureStore.setItemAsync('username', username);
      await SecureStore.setItemAsync('password', password);
    }

    return response;
  }

  const checkUsername = () => {
    if (!username) return 'Username cannot be empty.';
  };

  const checkPassword = () => {
    if (!password) return 'Please enter a password.';
  };

  const checkError = () => {
    setError(usernameError || passwordError);
  };

  const toggleLogin = () => {
    setLogin(!isLogin);
  };

  const resetErrors = () => {
    setUsernameError(!!checkUsername());
    setPasswordError(!!checkPassword());
    setUsernameErrorMessage('');
    setPasswordErrorMessage('');
  };

  const checkUsernameError = () => {
    const message = checkUsername();
    setUsernameError(!!message);
    setUsernameErrorMessage(message);
  };

  const checkPasswordError = () => {
    const message = checkPassword();
    setPasswordError(!!message);
    setPasswordErrorMessage(message);
  };

  useDidUpdate(checkUsernameError, [username]);
  useDidUpdate(checkPasswordError, [password]);
  useEffect(checkError, [usernameError, passwordError]);
  useEffect(setLoginErrorMessage.bind(null, ''), [username, password]);
  useEffect(resetErrors, [isLogin]);

  const login = async () => {
    // when logging in, just make sure username and password are filled in
    if (username && password) {
      setLoading(true);
      const response = isLogin ?
        await loginUser(username, password, true) :
        await registerUser(username, password);
      setLoading(false);
      const result = await response.json();
      if (response.status !== 200) {
        setLoginErrorMessage(result.message);
      } else {
        setUser(result);
        navigation.replace('Account');
      }
    }
  };

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
          onPress={login}
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