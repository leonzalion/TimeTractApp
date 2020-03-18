import * as SecureStore from 'expo-secure-store';
import {SERVER_URL} from "../../constants/Server";
import {encode as btoa} from "base-64";

const login = async (username, password, shouldStore = false) => {
  const response = await fetch(`${SERVER_URL}/users`, {
    method: 'get',
    headers: new Headers({
      'Authorization': 'Basic ' + btoa(
        `${username}:${password}`
      ),
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  });
  if (shouldStore && response.status === 200) {
    await SecureStore.setItemAsync('username', username);
    await SecureStore.setItemAsync('password', password);
  }
  return Promise.resolve(response);
};

export default login;