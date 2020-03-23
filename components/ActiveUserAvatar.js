import React, {useContext} from 'react';
import UserContext from '../contexts/User';
import * as ImagePicker from 'expo-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import * as ImageManipulator from 'expo-image-manipulator';
import UserAvatar from "./UserAvatar";
import {useMutation} from '@apollo/react-hooks';
import {ReactNativeFile} from 'apollo-upload-client';
import gql from 'graphql-tag';

const UPDATE_AVATAR_MUTATION  = gql`
  mutation ($input: UpdateUserAvatarInput!) {
    updateUserAvatar(input: $input)
  } 
`;

const DELETE_AVATAR_MUTATION = gql`
  mutation {
    deleteUserAvatar
  }
`;

export default function ActiveUserAvatar() {
  const {user, setUser} = useContext(UserContext);
  const {showActionSheetWithOptions} = useActionSheet();
  const [setAvatar] = useMutation(UPDATE_AVATAR_MUTATION);
  const [deleteAvatar] = useMutation(DELETE_AVATAR_MUTATION);

  async function editImage() {
    const options = [
      'Choose from Camera Roll',
      'Take Photo',
      'Reset Avatar',
      'Cancel'
    ];

    showActionSheetWithOptions({
      options,
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3,
    }, async buttonIndex => {
      if (buttonIndex === 0 || buttonIndex === 1) {
        let status;
        ({status} = await ImagePicker.requestCameraRollPermissionsAsync());
        if (status !== 'granted') {
          console.warn('permission to camera roll needed');
          return;
        }
        if (buttonIndex === 1) ({status} = await ImagePicker.requestCameraPermissionsAsync());
        if (status !== 'granted') {
          console.warn('permission to camera needed');
          return;
        }

        let imageResult;
        const imagePickerOptions = {
          allowsEditing: true,
          aspect: [1, 1]
        };
        if (buttonIndex === 0) imageResult = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
        else if (buttonIndex === 1) imageResult = await ImagePicker.launchCameraAsync(imagePickerOptions);

        if (!imageResult.cancelled) {
          const {uri: imageUri} = imageResult;
          const actions = [
            {
              resize: {
                width: 100,
                height: 100
              }
            }
          ];

          const {uri} = await ImageManipulator.manipulateAsync(imageUri, actions);
          const image = new ReactNativeFile({
            uri,
            name: 'avatar.jpg',
            type: 'image/jpeg'
          });
          const {data, error} = await setAvatar({variables: {input: {image}}});
          setUser({...user, avatarUrl: data.updateUserAvatar})
        }
      } else if (buttonIndex === 2) {
        const {data} = await deleteAvatar();
        setUser({...user, avatarUrl: data.deleteUserAvatar});
      }
    });
  }

  return (
    React.cloneElement(<UserAvatar user={user} />, {
      showEditButton: true,
      onEditPress: editImage
    })
  );

}