import fetchHeaders from '../fetchHeaders';
import {SERVER_URL} from '../../constants/Server';

export default async function patchUser({setUser, patches}) {
  const response = await fetch(`${SERVER_URL}/users`, {
    method: 'patch',
    headers: await fetchHeaders(),
    body: JSON.stringify(patches)
  });
  const result = await response.json();
  if (response.status !== 200) {
    console.warn(result);
    alert("Something went wrong. Error object: " + JSON.stringify(result));
    return;
  }
  setUser(result);
}


