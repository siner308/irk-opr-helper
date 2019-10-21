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

async function signout() {
  await firebase.auth().signOut();
  //await axios.post('/api/session/logout');

  deleteCookie('__session');
  location.reload();
}

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

  try {
    var token = await firebase.auth().currentUser.getIdToken();
    setCookie('__session', token, 100000);
  } catch (err) {
    console.log('token', err);
    return;
  }
}

async function registerKey() {
  var key = prompt('제작자에게 발급받은 키를 입력하세요');

  if (key === false) return;

  const response = await axios.post('/api/key', {
    key: key,
  });
}
