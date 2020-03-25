import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import UserContext from './contexts/User';
import TimeTract from './components/TimeTract';
import * as SecureStore from 'expo-secure-store';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';

const httpLink = createUploadLink({
  uri: 'https://timetract.herokuapp.com/graphql'
});

const authLink = setContext(async (_, {headers}) => {
  const token = await SecureStore.getItemAsync('jwt');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function App() {
  const [user, setUser] = useState(null);

  return (
    <ApolloProvider client={client}>
      <ActionSheetProvider>
        <UserContext.Provider value={{user, setUser}}>
          <NavigationContainer>
            <TimeTract />
          </NavigationContainer>
        </UserContext.Provider>
      </ActionSheetProvider>
    </ApolloProvider>
  );
}

export default App;
