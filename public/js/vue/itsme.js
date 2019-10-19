var app = new Vue({
  el: '#app',
  data() {
    return {
      items: [],
      codename: null,
    };
  },
  computed: {},
  methods: {
    /**
     * 서버에서 사전 데이터를 가져옴
     */
    fetchData: async function() {
      try {
        const response = await axios.get(
          'https://irk-opr-helper.firebaseio.com/itsme.json',
          {
            orderBy: `"createtime"`,
          },
        );
        // 내려오는 data 가 순수 array 가 아니므로 array 로 변환

        this.items = Object.keys(response.data)
          .map(key => {
            response.data[key].key = key;
            return response.data[key];
          })
          .reverse();
      } catch (err) {
        console.log(err);
      }
    },
  },
  created: async function() {
    /** 코드네임 쿠키가 있나 봐서 없으면 입력받아 저장 */
    await this.fetchData();
    var codename = getCookie('codename');

    if (codename == undefined) {
      while (true) {
        var newname = prompt(
          '코드네임을 입력해주세요.\n취소시, 열람은 가능하지만 등록은 불가능합니다.\n취소 후, 재입력하고 싶으면 새로고침을 하세요',
        );
        if (newname == null) break;
        if (newname.trim() == '') continue;
        else {
          setCookie('codename', newname, 100000);
          this.codename = newname;
          break;
        }
      }
    } else {
      this.codename = codename;
    }
  },
});
