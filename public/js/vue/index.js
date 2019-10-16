var app = new Vue({
  el: '#app',
  data() {
    return {
      /**
       * english, korean
       */
      dics: [],
      english: '',
      korean: '',
      isProcessing: false,
      codename: null,
      editStatus: [],
      editBeforeValue: '',

      sortkey: 'createtime',
      sortByAsc: false,
    };
  },
  computed: {
    /**
     * 원본 사전에 대해 키워드 필터링을 합니다. 검색 대상은 원문-영어
     */
    filtered: function() {
      // 입력값이 없으면 필터링 해제
      if (this.english.trim().length == 0) return this.dics;
      var result = this.dics.filter(dic => {
        return dic.english
          .toLowerCase()
          .includes(this.english.trim().toLowerCase());
      });

      return result;
    },
    /**
     * 폼의 입력값이 비어있는지 확인
     */
    isEmptyFormInputs: function() {
      return this.english.trim().length == 0 || this.korean.trim().length == 0;
    },
    /**
     * 현재 입력한 영어원문의 키워드가 사전에 이미 존재하는지 확인
     */
    englishDuplicated: function() {
      if (this.english.trim().length > 0) {
        return this.dics.some(e => {
          return (
            this.english.toLowerCase().trim() == e.english.toLowerCase().trim()
          );
        });
      }
      return false;
    },
    isFormInvalid: function() {
      if (this.english.trim().includes(' ')) return true;
      return false;
    },
  },
  methods: {
    /**
     * 서버에서 사전 데이터를 가져옴
     */
    fetchData: async function() {
      try {
        const response = await axios.get(
          'https://irk-opr-helper.firebaseio.com/dic.json',
          {
            orderBy: `"createtime"`,
          },
        );
        // 내려오는 data 가 순수 array 가 아니므로 array 로 변환

        this.dics = Object.keys(response.data)
          .map(key => {
            response.data[key].key = key;
            return response.data[key];
          })
          .reverse();
      } catch (err) {
        console.log(err);
      }
    },
    isEditing: function(key, where) {
      if (this.editStatus[key] === undefined) {
        this.editStatus[key] = new Object();
        this.editStatus[key]['english'] = false;
        this.editStatus[key]['korean'] = false;
      }
      return this.editStatus[key][where];
    },
    startEditing: async function(key, index, where) {
      this.editStatus[key][where] = true;
      await this.$forceUpdate();
      var input = this.$refs.items[index].querySelector('[name=' + where + ']');
      this.editBeforeValue = input.value;
      input.focus();
      input.select();
    },
    endEditing: function(key, where) {
      if (this.isEditing(key, where) == false) return;
      this.editStatus[key][where] = false;
      this.editBeforeValue = '';
      this.$forceUpdate();
    },
    cancelEdit: function(key, where) {
      if (this.isEditing(key, where) == false) return;
      var element = this.dics.find(e => e.key == key);
      element[where] = this.editBeforeValue;

      this.endEditing(key, where);
    },
    applyEdit: async function(key, where) {
      if (this.isEditing(key, where) == false) return;

      var element = this.dics.find(e => e.key == key);

      // 한글 수정을 했는데 기존과 같으면 취소
      if (
        (where == 'korean' &&
          this.editBeforeValue.trim() == element.korean.trim()) ||
        (where == 'english' &&
          this.editBeforeValue.trim().toLowerCase() ==
            element.english.trim().toLowerCase())
      )
        return this.cancelEdit(key, where);

      try {
        this.isProcessing = true;
        const response = await axios.put('/api/dic', {
          key: key,
          english: where == 'english' ? element.english : null,
          korean: where == 'korean' ? element.korean : null,
          codename: this.codename,
        });

        if (response.data.success == false) {
          console.log(response.data.message);
          this.cancelEdit(key, where);
        } else {
          element.updater = response.data.data.updater;
          this.endEditing(key, where);
        }
      } catch (err) {
        console.log(err);
        this.cancelEdit(key, where);
      } finally {
        this.isProcessing = false;
      }
    },
    // 사전의 맨 앞에 새로운 줄 추가
    addData: async function(data) {
      this.dics.unshift(data);
    },
    removeData: async function(data) {
      this.dics = this.dics.filter(e => e !== data);
    },
    onSubmit: async function() {
      try {
        if (this.english.trim().length == 0) return;
        if (this.korean.trim().length == 0) return;

        this.isProcessing = true;

        const response = await axios.post('/api/dic', {
          english: this.english.trim(),
          korean: this.korean.trim(),
          codename: this.codename,
        });

        if (response.data.success == false) console.log(response.data.message);
        else {
          var newRow = response.data.data;
          await this.addData(newRow);
          this.english = '';
          this.korean = '';
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isProcessing = false;
        this.$refs.english.focus();
      }
    },
    remove: async function(item) {
      if (
        confirm(
          '현재 항목을 삭제합니다\n[' + item.english + ', ' + item.korean + ']',
        ) == false
      )
        return;

      try {
        this.isProcessing = true;
        const response = await axios.delete('/api/dic', {
          data: {
            key: item.key,
          },
        });

        if (response.data.success == false) console.log(response.data.message);
        else this.removeData(item);
      } catch (err) {
        console.log(err);
      } finally {
        this.isProcessing = false;
      }
    },
    changeSort: function(key) {
      // 현재 정렬중인 키를 다시 정렬하게 하면 정렬 순서를 뒤집음, 그렇지 않으면 항상 오름차순
      if (this.sortkey == key) this.sortByAsc = !this.sortByAsc;
      else this.sortByAsc = true;
      this.sortkey = key;

      this.dics.sort((a, b) => {
        var va, vb;
        switch (this.sortkey) {
          case 'english':
            va = a.english;
            vb = b.english;
            break;
          case 'korean':
            va = a.korean;
            vb = b.korean;
            break;
          case 'createtime':
            va = a.createtime;
            vb = b.createtime;
            break;
          case 'creator':
            va = a.creator;
            vb = b.creator;
            break;
        }
        // 내림차순 정렬일 경우 sort 판별값에 -1 을 곱해서 뒤집어줌
        if (va > vb) return 1 * this.sortByAsc == true ? 1 : -1;
        if (va < vb) return -1 * this.sortByAsc == true ? 1 : -1;
        return 0;
      });
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
