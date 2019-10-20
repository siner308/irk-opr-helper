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

window.user = null;

document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.user = {
        name: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        uid: user.uid,
      };
      x = window.user;
      console.log(x);
      window.document.querySelector(
        '#auth',
      ).innerHTML = `<a class="nav-link" href="javascript:signout();">${x.email} - 로그아웃</a>`;
    } else {
      console.log('not auth');
      window.user = null;
      window.document.querySelector(
        '#auth',
      ).innerHTML = `<a class="nav-link" href="javascript:signin();">로그인</a>`;
    }
  });
});

function signout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      location.reload();
    })
    .catch(function(error) {
      // An error happened.
    });
}

function signin() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      location.reload();
    })
    .catch(function(err) {
      console.log(err);
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
