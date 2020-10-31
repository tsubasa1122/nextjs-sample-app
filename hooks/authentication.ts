import * as firebase from 'firebase/app';
import { atom, useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { User } from '../models/User';

const userState = atom<User>({
  key: 'user',
  default: null,
});

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (user !== null) {
      return;
    }

    console.log('Start useEffect');
    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        console.log(error);
      });

    firebase.auth().onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {
        console.log('Set user');
        setUser({
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  return { user };
}
