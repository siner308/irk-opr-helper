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

document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.document.querySelector('#auth').innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="javascript:register();">키 등록</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="javascript:signout();">로그아웃</a>
        </li>
      `;
    } else {
      window.user = null;
      window.document.querySelector('#auth').innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="javascript:signin();">로그인</a>
        </li>
      `;
    }
  });
});

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
    console.log('google login', result);
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

  /*
  idToken = result.credential.idToken;
  csrfToken = getCookie('csrfToken');

  try {
    const result = await axios.post('/api/session/login', {
      idToken: idToken,
      csrfToken: csrfToken,
    });
    console.log('session - ' + result);
  } catch (err) {
    console.log('session', err);
  }*/
}

async function registerKey() {
  var key = prompt('제작자에게 발급받은 키를 입력하세요');

  if (key === false) return;

  const response = await axios.post('/api/key', {
    key: key,
  });
}

/**
 * 구글 로그인 되어있을 때
 * - 쿠키 찾아봐서 있으면 앱 로그인으로 인식
 * - 서버에 정식 유저인지 요청
 *   - 맞으면 쿠키 저장
 *   - 틀리면 인증된 사용자 아니라고 출력
 *
 * 구글 로그인 아니면 로그인 버튼 출력
 */
