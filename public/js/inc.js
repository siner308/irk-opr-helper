function getCookie(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
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

function deleteCookie(cname) {
  var d = new Date(); //Create an date object
  d.setTime(d.getTime() - 1000 * 60 * 60 * 24); //Set the time to the past. 1000 milliseonds = 1 second
  var expires = 'expires=' + d.toGMTString(); //Compose the expirartion date
  window.document.cookie = cname + '=' + '; ' + expires; //Set the cookie with name and the expiration date
}
