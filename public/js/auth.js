// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyB376LdFhU4vB4jn00MsSrlvp5UQIprKN4',
  authDomain: 'irk-opr-helper.firebaseapp.com',
  databaseURL: 'https://irk-opr-helper.firebaseio.com',
  projectId: 'irk-opr-helper',
  storageBucket: 'irk-opr-helper.appspot.com',
  messagingSenderId: '111700909898',
  appId: '1:111700909898:web:9b375eca1995ca5cc16bb3',
  measurementId: 'G-8DNQWHW4W4',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/firebase.readonly');
firebase.auth().languageCode = 'kr';

function saveToken(token) {
  setCookie('__session', token, 100000);
}

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    app_auth.email = user.email;
    saveToken(await firebase.auth().currentUser.getIdToken(true));

    //console.log(user.email, this.email, app_auth.email);
    /*window.document.querySelector('#auth').innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="javascript:register();">키 등록</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript:signout();">로그아웃</a>
        </li>
      `;*/
  } else {
    thie.email = '';
    /*window.user = null;
    window.document.querySelector('#auth').innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="javascript:signin();">로그인</a>
        </li>
      `;*/
  }
});

async function signin() {
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  } catch (err) {
    alert(err.message);
    console.log(err.message);
  }

  try {
    var result = await firebase.auth().signInWithPopup(provider);
    user = result.user;
  } catch (err) {
    console.log(`google login`, err);
    return;
  }
}

async function signout() {
  await firebase.auth().signOut();

  deleteCookie('__session');
  location.reload();
}
