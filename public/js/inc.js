function getCookie(name) {
  // 변수를 선언한다.
  var cookies = document.cookie.split(';');

  // 쿠키를 추출한다.
  var searched = cookies.find(e => {
    return e.split('=')[0] == name;
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
  willCookie += name + '=' + encodeURIComponent(value) + ';';
  willCookie += 'Expires=' + date.toUTCString() + '';

  // 쿠키에 넣습니다.
  document.cookie = willCookie;
}
