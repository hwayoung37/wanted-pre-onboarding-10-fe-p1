import React, { useState } from "react";

//로그인 성공 및 실패 메시지 타입 정의(⚡type: 객체이외의 다양한 타입을 정의하는데 사용)
type LoginSuccessMessage = "SUCCESS";
type LoginFailMessage = "FAIL";

//LoginResponse 타입정의(⚡interface: 객체의 구조를 정의하고 메서드를 선언)
interface LoginResponse {
  message: LoginSuccessMessage | LoginFailMessage; //로그인 성공/실패시 메시지 뭐라고 뜰껀지?success/fail
  token: string;
}

interface UserInfo {
  name: string;
}

interface User {
  username: string;
  password: string;
  userInfo: UserInfo; //UserInfo라는 타입인데 이 타입은 객체이고 name라는 속성을 가지고 있다
}

const users: User[] = [
  {
    username: "blue",
    password: "1234",
    userInfo: { name: "blueStragglr" },
  },
  {
    username: "white",
    password: "1234",
    userInfo: { name: "whiteDwarf" },
  },
  {
    username: "red",
    password: "1234",
    userInfo: { name: "redGiant" },
  },
];

//뭐지? 시크릿 토큰과 관련된 시크릿 값 정의
const _secret: string = "1234qwer!@#$";

// ✅TODO: 올바른 username, password를 입력하면 {message: 'SUCCESS', token: (원하는 문자열)} 를 반환하세요.
// 👉 주어진 사용자 이름과 비밀번호를 검사하여 해당하는 사용자가 있으면 로그인 성공 메시지와 토큰을 반환하고, 없으면 로그인 실패로 처리.
//     반환된 토큰은 나중에 사용자 정보를 가져오는데 사용된다.
const login = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  //결과는 LoginResponse 형식의 객체 또는 null을 반환
  const user: User | undefined = users.find((user: User) => {
    //⚡find 함수: 배열에서 주어진 조건(return값)을 만족하는 첫번째 요소를 찾고 해당 요소 반환, 만족하는 요소가 없으면 undefined
    return user.username === username && user.password === password;
  });
  return user
    ? {
        //user 변수가 참인 경우(즉, user가 정의되어있을 때)
        message: "SUCCESS",
        token: JSON.stringify({ user: user.userInfo, secret: _secret }), //⚡JSON.stringify : 자바스크립트 객체를 JSON문자열로 변환
      }
    : null; //user 변수가 거짓인 경우(즉, user가 undefined일 경우)
};

// ✅TODO: login 함수에서 받은 token을 이용해 사용자 정보를 받아오세요. -> userInfo: { name: "..." }
// 👉주어진 토큰을 검증하고 유효한 경우 해당 사용자 정보를 찾아 반환한다. 그렇지 않은 경우 null을 반환하여 로그인 정보가 유효하지 않음을 나타낸다.
const getUserInfo = async (token: string): Promise<UserInfo | null> => {
  const parsedToken = JSON.parse(token); //⚡JSON.parse : JSON 문자열을 자바스크립트 객체로 변환
  //secret값이 존재하지 않거나 secret값이 _secret값과 일치하지 않는 경우 null 반환
  if (!parsedToken?.secret || parsedToken.secret !== _secret) return null;

  const loggedUser: User | undefined = users.find((user: User) => {
    if (user.userInfo.name === parsedToken.user.name) return user;
  });
  return loggedUser ? loggedUser.userInfo : null;
};

// 로그인 폼을 렌더링하고, 제출하면 로그인 및 사용자 정보를 업데이트 한다.
// 👉 사용자가 폼에 유효한 사용자 이름과 암호를 입력하면, 로그인을 시도하고, 성공하면 해당 사용자의 정보를 화면에 표시한다
const LoginWithMockAPI = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "" });

  const loginSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault(); //새로고침 방지

    // ✅TODO: form 에서 username과 password를 받아 login 함수를 호출하세요.
    //⚡formData: 자바스크립트 내장객체로 html form 요소에서 사용자가 입력한 데이터를 쉽게 수집/처리하도록 도와주는 객체

    //form 요소의 데이터를 사용할 수 있도록
    const formData = new FormData(event.currentTarget); //event.currentTarget: 이벤트가 발생한 html 요소 => form 요소

    const loginRes = await login(
      formData.get("username") as string, //formData객체에서 name속성이 username인 필드 값을 가져오며 해당 값은 문자열이다
      formData.get("password") as string
    ); //👉이렇게 가져온 정보를 login함수에 전달하여 사용자가 입력한 로그인 결과를 loginRes 변수에 저장합니다

    //loginRes가 존재하지 않으면 함수 종료(로그인 실패시 null반환하는 경우)
    //그렇지 않으면, 로그인이 성공한 경우이므로 해당 토큰을 사용하여 사용자 정보를 가져온다
    if (!loginRes) return;

    //getUserInfo호출: 토큰을 인자로 받아 서버에서 사용자 정보를 가져온다
    const userInfo = await getUserInfo(loginRes.token);
    if (!userInfo) return;

    //사용자 정보를 성공적으로 가져오면 userInfo 상태변수를 업데이트
    setUserInfo(userInfo);
  };

  return (
    <div>
      <h1>Login with Mock API</h1>
      <form onSubmit={loginSubmitHandler}>
        {/* ✅TODO: 여기에 username과 password를 입력하는 input을 추가하세요. 제출을 위해 button도 추가하세요. */}
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit" value="Submit">
          submit
        </button>
      </form>
      <div>
        <h2>User info</h2>
        {/* ✅TODO: 유저 정보를 보여주도록 구현하세요. 필요에 따라 state나 다른 변수를 추가하세요. */}
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default LoginWithMockAPI;
