import {encode as btoa} from "base-64";
import * as SecureStore from 'expo-secure-store';

export default async ({ auth = true, contentType = 'application/json', accept = 'application/json' } = {}) => {
  const headerObj = {
    'Content-Type': contentType,
    'Accept': accept
  };

  if (auth) {
    const username = await SecureStore.getItemAsync('username');
    const password = await SecureStore.getItemAsync('password');
    headerObj.Authorization =
      'Basic ' + btoa(`${username}:${password}`);
  }

  return new Headers(headerObj);
}