var app_auth = new Vue({
  el: '#auth',
  data() {
    return {
      email: null,
      codename: '',
    };
  },
  computed: {},
  methods: {},
  created: async function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
        app_auth.email = user.email;
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
  },
});
