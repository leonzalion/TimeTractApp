import { Linking } from 'expo';
import {AuthSession} from "expo";
import {useContext} from 'react';
import {useMutation} from "@apollo/react-hooks";
import gql from 'graphql-tag';
import UserContext from '../contexts/User';
import {RT_CLIENT_ID} from '../secrets';

const CONNECT_TO_RESCUETIME_MUTATION = gql`
  mutation ($input: ConnectUserToRescueTimeInput!) {
    connectUserToRescueTime(input: $input)
  }
`;

export default function useRescueTime() {
  const {user, setUser} = useContext(UserContext);
  const [connectRescueTime] = useMutation(CONNECT_TO_RESCUETIME_MUTATION);

  return async function() {
    const url = 'https://www.rescuetime.com/oauth/authorize?' +
      `client_id=${RT_CLIENT_ID}` +
      '&redirect_uri=https://timetract.herokuapp.com/&response_type=code';

    const appUrl = Linking.makeUrl();
    let result = await AuthSession.startAsync({authUrl: url, returnUrl: appUrl});

    if (result.type === 'cancel') {
      console.warn('auth session cancelled');
      return;
    }

    if (result.url) {
      const {code: authCode} = Linking.parse(result.url).queryParams;

      if (!authCode) {
        console.warn("No authorization code was sent.");
        return;
      }

      const rt_result = await connectRescueTime({variables: {input: {authCode}}});
      setUser({...user, accessToken: rt_result.data.connectUserToRescueTime});
    }
  };
}