# 함수 바인딩

> `setTimeout`에 메서드를 전달할 때처럼, 객체 메서드를 콜백으로 전달할 때 `this 정보가 사라지는` 문제가 발생!

```js
let user = {
    firstName: "John",
    sayHi() {
        alert(`Hello, ${this.firstName}`);
    }
};

setTimeout(user.sayHi, 1000);
```

## 방법 1: 래퍼
> 가장 간단한 해결책은 래퍼 함수를 사용하는 것

```js
let user = {
    firstName: "John",
    sayHi() {
        alert(`Hello, ${this.firstName}`);
    }
};

setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
```

- 위 예시가 의도한 대로 동작하는 이유는 *'외부 렉시컬 환경'* 에서 `user`를 받아와 메서드를 호출 했기 때문입니다.

```js
setTimeout(function() {
  user.sayHi(); // Hello, John!
}, 1000);
```

- 위와 같은 코드는 아래와 같이 변경할 수 있습니다.

```js
setTimeout(() => user.sayHi(), 1000); // Hello, John!
```

- 이렇게 코드를 작성하면 간결해져서 보기 좋지만, **약간의 취약성이 생깁니다.**

- setTimeout이 트리거 되기 전에 **(1초가 지나기 전에)** `user`가 변경되면, 변경된 객체의 메서드를 호출하게 됩니다.

```js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// 1초가 지나기 전에 user의 값이 바뀜
user = { sayHi() { alert("또 다른 사용자!"); } };

// setTimeout에 또 다른 사용자!
```

### 그럼 어떻게 해야하나요??
- 2번째 방법을 사용하면 이런 일이 발생하지 않습니다.

## 방법 2: bind

> 모든 함수는 `this`를 수정하게 해주는 내장 메서드 bind를 제공합니다.

- 기본 문법은 다음과 같습니다.

```js
// 더 복잡한 문법은 뒤에 나옵니다.
let boundFunc = func.bind(context);
```