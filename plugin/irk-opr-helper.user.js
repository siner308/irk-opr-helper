// ==UserScript==
// @name            IRK OPR Helper
// @version         1.0.003
// @description     OPR Helper For IRK users
// @author          HawkBro
// @match           https://opr.ingress.com/
// @match           https://opr.ingress.com/?login=true
// @match           https://opr.ingress.com/recon
// @match           https://opr.ingress.com/help
// @match           https://opr.ingress.com/faq
// @match           https://opr.ingress.com/guide
// @match           https://opr.ingress.com/settings
// @match           https://opr.ingress.com/upgrades*
// @grant           unsafeWindow
// @grant           GM_notification
// @grant           GM_addStyle
// @downloadURL     https://github.com/hawkkim/irk-opr-helper/raw/master/plugin/irk-opr-helper.user.js
// @updateURL       https://github.com/hawkkim/irk-opr-helper/raw/master/plugin/irk-opr-helper.user.js
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

/* globals unsafeWindow, angular */

const w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

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

    // check if subCtrl exists (should exists if we're on /recon)
    if (subMissionDiv !== null && w.$scope(subMissionDiv).subCtrl !== null) {
      const subController = w.$scope(subMissionDiv).subCtrl;

      $('span[ng-bind="subCtrl.pageData.streetAddress"]').unwrap();
      /**
       * @type Element
       */
      const addressElement = w.document.querySelector(
        'span[ng-bind="subCtrl.pageData.streetAddress"]',
      );

      const addressReverse = parseAddress(addressElement).join(' ');
      try {
        var x = await searchDic(addressReverse);
        addressElement.innerText = x;
      } catch (err) {
        addressElement.innerText = addressReverse;
      }
    }
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

  /**
   * 주소 엘리먼트 파싱
   * @param { Element } element
   */
  function parseAddress(element) {
    /**
     * @type String
     */
    let address = element.innerText;
    let splitted = address.replace('South Korea', '대한민국').split(/, | /);
    splitted = splitted.filter(e => {
      return e != '';
    });
    if (splitted.indexOf('대한민국') != 0) splitted.reverse();

    return splitted;
  }
}
