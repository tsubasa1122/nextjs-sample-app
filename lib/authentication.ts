import * as firebase from 'firebase/app';

function authenticate() {
  firebase
    .auth()
    .signInAnonymously()
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.uid);
      console.log(user.isAnonymous);
    } else {
    }
  });
}

if (process.browser) {
  authenticate();
}
