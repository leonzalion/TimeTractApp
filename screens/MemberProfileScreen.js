import React, {useEffect} from 'react';
import ProfileOverview from '../components/ProfileOverview';

export default function MemberProfileScreen({navigation, route}) {
  const user = route.params.user;
  useEffect(() => {
    navigation.setOptions({title: user.username});
  }, []);
  return (
    <ProfileOverview user={user} />
  );
}
