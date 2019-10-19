// ==UserScript==
// @name            IRK OPR Helper
// @version         1.1.001
// @description     OPR Helper For IRK users
// @author          HawkBro
// @match           https://opr.ingress.com/
// @match           https://wayfarer.nianticlabs.com/review
// @match           https://wayfarer.nianticlabs.com/nominations
// @grant           unsafeWindow
// @grant           GM_notification
// @grant           GM_addStyle
// @downloadURL     https://github.com/hawkkim/irk-opr-helper/raw/master/plugin/irk-opr-helper.user.js
// @updateURL       https://github.com/hawkkim/irk-opr-helper/raw/master/plugin/irk-opr-helper.user.js
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

/* globals unsafeWindow, angular */

const w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
var nomName = '';

setTimeout(() => {
  init();
}, 250);

function init() {
  let tryNumber = 15;

  const initWatcher = setInterval(() => {
    if (tryNumber === 0) {
      clearInterval(initWatcher);
      return;
    }
    if (w.angular) {
      let err = false;
      try {
        initAngular();
      } catch (error) {
        err = error;
        // console.log(error);
      }
      if (!err) {
        try {
          initScript();
          clearInterval(initWatcher);
        } catch (error) {
          console.log(error);
          if (error.message === '41') {
            //addRefreshContainer()
          }
          if (error.message !== '42') {
            clearInterval(initWatcher);
          }
        }
      }
    }
    tryNumber--;
  }, 1000);

  async function initAngular() {
    const el = w.document.querySelector('[ng-app="portalApp"]');
    w.$app = w.angular.element(el);
    w.$injector = w.$app.injector();
    w.inject = w.$injector.invoke;
    w.$rootScope = w.$app.scope();

    w.getService = function getService(serviceName) {
      w.inject([
        serviceName,
        function(s) {
          w[serviceName] = s;
        },
      ]);
    };

    w.$scope = element => w.angular.element(element).scope();
  }

  async function initScript() {
    const subMissionDiv = w.document.getElementById('NewSubmissionController');
    const nomiDiv = w.document.querySelector('.nominations-controller');

    // check if subCtrl exists (should exists if we're on /recon)
    if (subMissionDiv !== null && w.$scope(subMissionDiv).subCtrl !== null) {
      const subController = w.$scope(subMissionDiv).subCtrl;

      /*$(
        'span[ng-show="!subCtrl.imageDate && subCtrl.pageData.streetAddress"]',
      ).unwrap();*/
      /**
       * @type Element
       */
      const addressElement = w.document.querySelector(
        'span[ng-show="!subCtrl.imageDate && subCtrl.pageData.streetAddress"]',
      );

      const addressReverse = parseAddress(addressElement).join(' ');
      try {
        var x = await searchDic(addressReverse);
        addressElement.innerText = x;
      } catch (err) {
        addressElement.innerText = addressReverse;
      }

      $('.card-area').prepend(
        `<h1 style='background-color:#ee9; color:#c00;'>${addressElement.innerText}</h1>`,
      );

      const watcher = setInterval(async () => {
        if (subController.pageData != null) {
          clearInterval(watcher);

          try {
            var itsme = await itsMe(
              subController.pageData.title,
              subController.pageData.lng,
              subController.pageData.lat,
              null,
            );

            if (itsme.success === true && itsme.data != null) {
              $('.card-area').prepend(
                '<h1 style="background-color:#9ee; color:#0c0;">접니다!!! - ' +
                  itsme.data[0].creator +
                  '</h1>',
              );
            }
          } catch (err) {
            console.log(err);
          }
        }
      }, 100);
    }

    if (nomiDiv !== null && w.$scope(nomiDiv).nomCtrl !== null) {
      initItsMe(w.$scope(nomiDiv).nomCtrl);
    }
  }

  this.codename = '';

  function initItsMe(nomCtrl) {
    var codename = getCookie('codename');

    if (codename === undefined) {
      while (true) {
        var newname = prompt(
          '코드네임을 입력해 주시면 "접니다!" 기능을 사용할 수 있습니다',
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

    if (this.codename == undefined || this.codename.trim() == '') return;

    setInterval(async () => {
      if (nomCtrl.canModify(nomCtrl.currentNomination) == false) return;

      var el = $('div.nomination-detail > div.nomination-title');
      var newname = el.text();
      if (
        newname != null &&
        nomName != newname.trim() &&
        newname.trim().length > 0 &&
        $('a[rel=noopener]').length > 0
      ) {
        nomName = newname.trim();

        var href = $('a[rel=noopener]')[0].href;
        var s1 = href.split('=')[1];
        var s2 = s1.split('&')[0];
        var s3 = s2.split(',');

        var imageurl = $('img.nomination-photo').attr('src');

        try {
          var result = await itsMe(newname.trim(), s3[1], s3[0], this.codename);

          if (result.success == false) throw null;
          $('[name=itsme-submit]').remove();
          if (result.data == null || result.data.length == 0) {
            $('.nomination-header-buttons .nom-buttons').append(`
            <button style="width:200px;" class="button-secondary button-upgrade" id="itsme-submit" name="itsme-submit">${newname.trim()}<br />접니다! 에 등록</button>
            `);

            $('#itsme-submit').click(async () => {
              var itsme_submit = await $.ajax({
                type: 'post',
                url: 'https://irk-opr-helper.web.app/api/itsme',
                data: {
                  name: newname.trim(),
                  x: s3[1],
                  y: s3[0],
                  image: imageurl,
                  codename: getCookie('codename'),
                },
              });

              if (itsme_submit.success == true) {
                alert('정상 등록되었습니다');
                $('[name=itsme-submit]')
                  .text('등록 됨')
                  .attr('disabled', true);
              }
            });
          } else {
            $('.nomination-header-buttons .nom-buttons').append(`
            <button class="button-secondary disabled-button" name="itsme-submit" style="width:200px;" disabled>
            ${newname.trim()}<br />
            접니다! 등록되어있음
            </button>
            `);
          }
          //return result.data;
        } catch (e) {}
      }
    }, 500);
  }

  async function searchDic(word) {
    var result;
    try {
      result = await $.ajax({
        type: 'get',
        url: 'https://irk-opr-helper.web.app/api/dic',
        data: {
          keyword: word,
        },
      });

      if (result.success == false) throw null;
      return result.data;
    } catch (error) {
      return word + '<br />불러오기에 실패하였습니다';
    }
  }

  async function itsMe(name, x, y, codename) {
    try {
      return await $.ajax({
        type: 'get',
        url: 'https://irk-opr-helper.web.app/api/itsme',
        data: {
          name: name,
          x: x,
          y: y,
          codename: codename,
        },
      });
    } catch (e) {
      return { success: false, message: null, data: e };
    }
  }

  /**
   * 주소 엘리먼트 파싱
   * @param { Element } element
   */
  function parseAddress(element) {
    /**
     * @type String
     */
    let address = element.innerText.replace('도로명 주소:', '');
    let splitted = address.replace('South Korea', '대한민국').split(/, | /);
    splitted = splitted.filter(e => {
      return e != '';
    });
    if (splitted.indexOf('대한민국') != 0) splitted.reverse();

    return splitted;
  }
}

function getCookie(name) {
  // 변수를 선언한다.
  var cookies = document.cookie.split(';');

  // 쿠키를 추출한다.
  var searched = cookies.find(e => {
    return e.split('=')[0].trim() == name;
  });

  if (searched == undefined) return undefined;
  var result = decodeURIComponent(searched.replace(name + '=', ''));

  return result;
  /*for (var i in cookies) {
    if (cookies[i].search(name) != -1) {
      alert(decodeURIComponent(cookies[i].replace(name + '=', '')));
    }
  }*/
}

function setCookie(name, value, day) {
  // 변수를 선언한다.
  var date = new Date();
  date.setDate(date.getDate() + day);

  var willCookie = '';
  willCookie += name.trim() + '=' + encodeURIComponent(value) + ';';
  willCookie += 'Expires=' + date.toUTCString() + '';

  // 쿠키에 넣습니다.
  document.cookie = willCookie;
}
