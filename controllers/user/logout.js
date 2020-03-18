import * as SecureStore from 'expo-secure-store';

const logout = async () => {
  await SecureStore.deleteItemAsync('username');
  await SecureStore.deleteItemAsync('password');
};

export default logout;