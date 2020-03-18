import React, {useContext} from 'react';
import UserContext from '../contexts/User';
import * as ImagePicker from 'expo-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import * as ImageManipulator from 'expo-image-manipulator';
import fetchHeaders from '../controllers/fetchHeaders';
import patchUser from '../controllers/user/patch';
import {SERVER_URL} from '../constants/Server';
import UserAvatar from "./UserAvatar";

export default function ActiveUserAvatar() {
  const {user, setUser} = useContext(UserContext);
  const {showActionSheetWithOptions} = useActionSheet();

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
          const {uri} = imageResult;

          const actions = [
            {
              resize: {
                width: 250,
                height: 250
              }
            }
          ];

          const saveOptions = {base64: true};
          const {base64} = await ImageManipulator.manipulateAsync(uri, actions, saveOptions);

          const response = await fetch(`${SERVER_URL}/users/avatar`, {
            method: 'post',
            headers: await fetchHeaders(),
            body: JSON.stringify({
            avatarBase64: base64
            })
          });
          const result = await response.json();

          if (response.status !== 200) {
            console.warn(result);
            alert('Failed to upload avatar. Reason:\n' + result.message);
            return;
          }

          const {secure_url} = result;
          await patchUser({
            setUser,
            patches: {avatar_url: secure_url}
          });
        }
      } else if (buttonIndex === 2) {
        await patchUser({
          setUser,
          patches: {avatar_url: ''}
        });
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