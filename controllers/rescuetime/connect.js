import { Linking } from 'expo';
import {AuthSession} from "expo";
import fetchHeaders from '../fetchHeaders';
import patchUser from '../user/patch';
import {SERVER_URL} from '../../constants/Server';

export default async function connect({user, setUser}) {
  const app_url = Linking.makeUrl();
  const url = `${SERVER_URL}/users/connect?app_url=${encodeURIComponent(app_url)}`;
  const tokenUrl = `${SERVER_URL}/users/token?app_url=${encodeURIComponent(app_url)}`;

  let result = await AuthSession.startAsync({authUrl: url, returnUrl: app_url});
  console.log(result);

  if (result.type === 'cancel') {
    console.warn('auth session cancelled');
    return;
  }

  if (result.url) {
    const {code: auth_code} = Linking.parse(result.url).queryParams;

    if (!auth_code) {
      console.warn("No authorization code was sent.");
      return;
    }

    const rt_result = await (await fetch(tokenUrl, {
      method: 'post',
      headers: await fetchHeaders({auth: false}),
      body: JSON.stringify({auth_code})
    })).json();

    if (rt_result.error) {
      console.warn(rt_result);
      return;
    }

    const access_token = rt_result.access_token;

    await patchUser({
      user,
      setUser,
      patches: {rescuetime: {access_token}}
    });
  }
}