# 4. this 값이 undefined인 함수 고치기 (Fix a function that loses "this")

#### 아래 함수 `askPassword()`는 비밀번호를 먼저 확인하고 그 결과에 따라 `user.loginOk`나 `user.loginFail`을 호출해야 합니다.

#### 그런데 함수를 호출하면 에러가 발생합니다. 에러는 왜 발생했을까요?

#### 에러가 발생하지 않도록 색칠된 줄을 고쳐보세요. 다른 줄은 바꾸지 않아야 합니다.

```js
function askPassword(ok, fail) {
  let password = prompt("비밀번호를 입력해주세요.", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  loginOk() {
    alert(`${this.name}님이 로그인하였습니다.`);
  },

  loginFail() {
    alert(`${this.name}님이 로그인에 실패하였습니다.`);
  },
};
```
```js
askPassword(user.loginOk, user.loginFail);
```

내가 작성한 답

```js
askPassword(user.loginOk.bind(user), user.loginFail.bind(user));
```

ask는 `loginOk`, `loginFail`을 호출할 때 `this=undefined` 라고 자연스레 가정하기 때문에

`bind` 함수를 사용해 컨텍스트를 고정 시켜줌.

그외의 답

```js
askPassword(() => user.loginOk(), () => user.loginFail());
```

이렇게 화살표 함수를 사용하는 방법 또한 대개 잘 동작하며 가독성도 좋습니다

다만 이 방법은 `askPassword`가 *호출됐으나* 사용자가 프롬포트 대화상자에 값을 제출하고 `() => user.loginOk()` 를 *호출하기 전*에 `user` 변수가 바뀌는 등의 복잡한 상황에서는 오작동할 가능성이 있습니다.