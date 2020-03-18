import React from 'react';
import {Avatar} from 'react-native-elements';

export default function UserAvatar({user, ...props}) {

  const avatar = (
    <Avatar
      rounded={true}
      size="xlarge"
      {...props}
    />
  );

  if (user.avatar_url) {
    return (
      React.cloneElement(avatar, {
        source: {uri: user.avatar_url}
      })
    );
  } else {
    return (
      React.cloneElement(avatar, {
        title: user.username[0].toUpperCase(),
      })
    );
  }
}