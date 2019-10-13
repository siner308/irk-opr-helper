__!!보안강조!!__

__모바일인 분들은 아래의 View All of README.md 를 눌러서 현재 문서를 꼭! 끝까지 다 읽어주세요!!!__


# irk-opr-helper

IRK 유저분들을 위한 리콘 도우미 플러그인 입니다

OPR Tools 코드를 기반으로 제작되었습니다


### 제작
- HawkBro@RES/Incheon

### 주의사항
```diff
- Resistance 유저만을 위한 프로그램입니다. 본 페이지 링크의 공유는 보안이 보장되는 공간에서만 해주십시오
- 현재 페이지는 검색으로 들어올 수는 있지만 공유시 보안에 각별히 신경 써주시기 바랍니다
- Resistance 이외의 유저가 사용하는것이 인지 되면 서비스를 종료 할 수 있습니다
```
## 제공하는 기능
- 주소 나열 방법이 뒤집어진 영미식 주소 표기법을 한국식으로 바꾸어줍니다
- 사전 등록에 기반한 주소의 번역을 제공 합니다
  - https://irk-opr-helper.web.app
  - 위 사이트에서 직접 등록 가능합니다

## 앞으로 제공할 기능
- 구글 인증을 통한 로그인 기능 (초대 코드에 의해서만 인증 가능)
  - 인증을 사전/포털신청 등록 페이지에 적용
  - 인증을 플러그인에 적용 (가능할지 모르겠음)
- 내가 포탈 신청한 건을 등록. 나와 모든 사람이 신청한 모든 신청 건 확인. 리콘 페이지에 떴을 때 별도로 표시
- 포털 수정한 건을 등록. 위와 같이 확인/표시
- 특정 지역이나 구역에서 활동하는 유저 등록. 리콘 페이지에 해당 위치가 뜰 경우 별도로 표시

## 설치 링크
- Tampermonkey 가 이미 설치되어 있으면 아래의 링크를 눌러서 설치 가능합니다
- https://github.com/hawkkim/irk-opr-helper/raw/master/plugin/irk-opr-helper.user.js

### 사용 환경
- PC, Android에서 TamperMonkey 플러그인을 사용할 수 있는 브라우저 (iOS 지원 불가)
- iOS에서 TamperMonkey를 사용할 수 있는 브라우저가 있다면 제보 바랍니다

### 필수 프로그램
- TamperMonkey 플러그인 - 사용할 브라우저에 맞게 아래 주소에서 설치하십시오. (IITC를 사용하는 중이면 이미 깔려 있습니다)
  - 인터넷익스플로러 : 구시대의 유물은 지원하지 않습니다
  - 크롬 https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
  - 엣지 https://www.tampermonkey.net/?ext=dhdg&browser=edge
  - 사파리 https://www.tampermonkey.net/?ext=dhdg&browser=safari
  - 파이어폭스 https://www.tampermonkey.net/?ext=dhdg&browser=firefox
  - 오페라 https://www.tampermonkey.net/?ext=dhdg&browser=opera
  - 안드로이드 https://play.google.com/store/apps/details?id=net.biniok.tampermonkey
   
### 기타 도움이 되는 프로그램
- OPR Tools
  - 리콘에 도움이 많이 되는 프로그램 입니다. 점수를 키보드로 줄 수 있어 빠른 리콘을 돕습니다
  - https://gitlab.com/1110101/opr-tools/raw/master/opr-tools.user.js
  
### 설치 방법
1. 사용할 브라우저에서 위의 TamperMonkey 플러그인을 설치한다
2. 아래의 링크를 눌러 플러그인 설치
  - https://github.com/hawkkim/irk-opr-helper/raw/master/plugin/irk-opr-helper.user.js
  - 흰 화면에 코드만 나오면 플러그인을 다시 설치해야 합니다
  - Tampermonkey 아이콘과 함께 어떤 화면이 나오고 [설치] 버튼이 나오면 눌러서 설치하면 됩니다
3. 리콘 사이트 새로고침
4. 수 초 후에 포털 신청건의 주소가 '대한민국' 이 앞으로 오며 영어로 된 주소가 한글로 변하면 설치에 성공한 것입니다
5. 플러그인 자동 업데이트 주기가 굉장히 느린걸로 파악되고 있습니다. TamperMonkey 설정에 들어가서 자동업데이트 주기를 빠르게 바꿔주세요

<img src='/public/image/tempermonkey-dashboard.png' style='border:1px solid red;'>
<img src='/public/image/tampermonkey-settings.png' style='border:1px solid red;'>

### 버그제보
코드네임 HawkBro로 연락 주십시오. 인스턴트 메신저로만 연락을 받으니 연락 수단이 없으신 분들은 근처 유저를 수소문 하세요.

현재 사이트에 가입이 되어있는 경우는 https://github.com/hawkkim/irk-opr-helper/issues/new 이곳에서 이슈를 보고 해 주시기 바랍니다 

### Donation
받지 않습니다.
정 도움을 주시고 싶으신 분은 커피나 사주세요.
프로그램의 원재료는 개발자와 커피 입니다

### 개발환경
- Database - Google Firebase Realtime Database
- Web (Frontend) - Vue.js / Bootstrap
- Web (Backend) - Node.js / Google Firebase
