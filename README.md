# 샘플코드 설명(directory)

- `actions` : 사용자 이벤트를 받아서 할일을 정의
- `assets` : Scss, 이미지 등 리소스
- `common` : Utils, Constants 등 공통 코드 관리
- `components` : 재사용 가능한 독립된 UI 파일
- `pages` : 전체 페이지 화면
- `reducers` : 현재 상태와 액션 객체를 파라미터로 받아와서 새로운 상태를 반환
- `router` : 화면 라우터 관리 및 기본 layout
- `store` : 앱 전체의 상태를 관리하는 공간

# react-web(base)

### 구동

1. `npm install`
2. `npm start`

### 빌드

1. `npm run build`

```
개발: npm run build:development
aws 개발서버 : npm run build:awsdevelopment
상용: npm run build:production
```

2. dir ### build 생성파일 업로드

### 환경 (구동 확인)

- node version : **16.13.2**
- npm version : **8.1.2**

### 라이브러리 버전 관리

1. 최신버전 확인 : `npm outdated`
2. 일괄 업데이트 : `npm update`
3. 단일 업데이트 : `npm i [모듈명]@[버전]`

### 노드버전 관리

1. nvm 설치

- Homebrew 사용시 아래 순서대로 nvm 설치 가능합니다.

  1.  `brew install nvm`
  2.  `nvm --version`
  3.  버전확인이 안될 경우 > 환경변수 설정 필요
      > 1. ~/.nvm 디텍토리 생성 > 이미 존재하면 생략
      >
      > - mkdir ~/.nvm
      >
      > 2. 쉘 수정 (bash) : vi ~/.bash_profile
      >
      > - ```
      >   export NVM_DIR="$HOME/.nvm"
      >   [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"
      >   [ -s "/usr/local/opt/nvm/etc/bash_completion" ] && . "/usr/local/opt/nvm/etc/bash_completion"
      >   ```
      > - 적용 : source ~/.bash_profile
      >
      > 3. 쉘 수정 (zsh) : vi ~/.zxhrc
      >
      > - export NVM_DIR="$HOME/.nvm"
      > - . $(brew --prefix nvm)/nvm.sh
      > - 적용 : source ~/.zshrc

- Windows 사용시 아래 URL을 참고해주세요.  
   https://seunghyun90.tistory.com/52

2. nvm 명령어

- 설치 : `nvm install v[설치버전]`
- 삭제 : `nvm uninstall v[설치버전]`
- 사용 : `nvm use v[사용할 버전]`
- 설치된 노드 버전 리스트 확인 : `nvm ls`
- 터미널 시작시 노드 기본버전 설정 : `nvm alias default v[설치버전]`
- 노드버전 확인 : `node --version`
- nvm 버전 확인 : `nvm --version`

3. 프로젝트에 버전 명시 > `.nvmrc` 파일

### 에디터 간격 설정

1. vscode 기준
   - 우측하단 Spaces Click
   - Indent Using Spaces Click
   - 2로 변경
2. intellij 기준
   - Preferences -> Code Style -> JavaScript -> Tab size, Indent, Continuation indent = 2 로 변경
