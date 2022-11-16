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

---

### Q. 그럼 어떻게 해야하나요??
#### A. 2번째 방법을 사용하면 이런 일이 발생하지 않습니다.

## 방법 2: bind

#### 모든 함수는 `this`를 수정하게 해주는 내장 메서드 bind를 제공합니다.

#### 기본 문법은 다음과 같습니다.

```js
// 더 복잡한 문법은 뒤에 나옵니다.
let boundFunc = func.bind(context);
```

`func.bind(context)`는 함수처럼 호출 가능한 **특수 객체**를 반환합니다. 이 객체를 호출하면 `this`가 `context`로 고정된 함수 `func`가 반환됩니다.

따라서 `boundFunc`를 호출하면 `this`가 고정된 `func`를 호출하는 것과 동일한 효과를 본다.

#### <잠깐만요!> ㅁ..뭐라구요?

아래 코드를 봅시다

```js
let user = {
  firstName: "John"
};

function func() {
  alert(this.firstName);
}
```
```js
let funcUser = func.bind(user);
funcUser(); // John
```

짐작이 좀 가시나요?

여기서 `func.bind(user)`는 `func`의 `this`를 `user`로 *바인딩한 변형* 이라고 생각하면 됩니다

인수는 원본 함수 `func`에 *그대로* 전달됩니다.

```js
let user = {
  firstName: "John"
};

function func(phrase) {
  alert(phrase + ', ' + this.firstName);
}

// this를 user로 바인딩합니다.
let funcUser = func.bind(user);
```
```js
funcUser("Hello"); // Hello, John (인수 "Hello"가 넘겨지고 this는 user로 고정됩니다.)
```

```js
let user = {
  firstName: "John",
  sayHi() {
    alert(`Hello, ${this.firstName}!`);
  }
};

let sayHi = user.sayHi.bind(user); // (*)

// 이제 객체 없이도 객체 메서드를 호출할 수 있습니다.
sayHi(); // Hello, John!

setTimeout(sayHi, 1000); // Hello, John!

// 1초 이내에 user 값이 변화해도
// sayHi는 기존 값을 사용합니다.
user = {
  sayHi() { alert("또 다른 사용자!"); }
};
```

`(*)` 로 표시한 줄에서 메서드 `user.sayHi`를 가져오고, 메서드에 `user`를 바인딩 합니다.
`sayHi`는 이제 *묶인* 함수가 되어 단독으로 호출할 수 있고, `setTimeout` 에 전달하여 호출할 수도 있습니다.
어떤 방식이든 컨텍스트는 원하는 대로 고정 됩니다.

##### 아래 예시는 인수는 *그대로* 전달되고 `bind`에 의해 `this`만 고정된 것을 확인할 수 있습니다

```js
let user = {
  firstName: "John",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hello"); // Hello, John (인수 "Hello"가 say로 전달되었습니다.)
say("Bye"); // Bye, John ("Bye"가 say로 전달되었습니다.)
```

## 부분 적용
지금 까지 `this` 바인딩에 대해서 얘기 해보았습니다.
`this`가 아닌 인수도 바인딩 가능하다는 얘기를 여기서 해볼 것이라 관심이 없으신 분들은 넘어가도 좋습니다.

인수 바인딩은 잘 쓰이진 않지만 가끔 유용할 때가 있습니다.
그럴 때가 언젠가 오겠죠..? 배워두면 나쁠거 없으니까요

`bind`의 전체 문법은 다음과 같습니다.

```js
let bound = func.bind(context, [arg1], [arg2], ...);
```

`bind`는 컨텍스트를 `this`로 고정하는 것 뿐만 아니라 함수의 인수도 고정해줍니다.

곱셈을 해주는 함수 `mul(a, b)`를 예시로 들어보겠습니다.

```js
function mul(a, b) {
  return a * b;
}
```

`bind`를 사용해 새로운 함수 `double`을 만들겠습니다.
```js
function mul(a, b) {
  return a * b;
}
```
```js
let double = mul.bind(null, 2);

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```

`mul.bind(null, 2)`를 호출하면 새로운 함수 `double`이 만들어집니다.
`double`엔 컨텍스트가 `null`, 1번째 인수는 `2`인 `mul`의 호출 결과가 전달됩니다.
추가 인수는 *그대로* 전달됩니다.

이런 방식을 [부분 적용](https://en.wikipedia.org/wiki/Partial_application)이라고 부릅니다. 
부분 적용을 사용하면 기존 함수의 매개변수를 고정하여 새로운 함수를 만들 수 있습니다.

위 예시에선 `this`를 사용하지 않았다는 점에 주목하시기 바랍니다.
`bind`엔 컨텍스트를 항상 넘겨줘야 하므로 `null`을 사용했습니다.

부분 적용을 사용해 3을 곱해주는 함수 `trible`을 만들어 봅시다.


```js
let triple = mul.bind(null, 2);

alert( triple(3) ); // = mul(2, 3) = 6
alert( triple(4) ); // = mul(2, 4) = 8
alert( triple(5) ); // = mul(2, 5) = 10
```

#### <잠깐만요!> 아니.. 뭐 봐도 모르겠고.. 부분 함수나 부분 적용은 왜 만들어요?

가독성이 좋은 이름(double, triple)을 가진 독립 함수를 만들 수 있다는 이점 때문입니다.
게다가 `bind`를 사용해 1번째 인수를 고정할 수 있기 때문에 매번 인수를 전달할 필요도 없어집니다.

이 외에도 부분 적용은 매우 포괄적인 함수를 기반으로 덜 포괄적인 변형 함수를 만들 수 있다는 점에서 유용합니다.

함수 `send(from, to, text)`가 있다고 가정해봅시다.
객체 `user` 안에서 부분 적용을 활용하면, 전송 주체가 현재 사용자인 함수 `sendTo(to, text)`를 구현할 수 있습니다.

##### <잠깐만요!> 봐도 모르겠네요..
음... 쓸 때가 분명히 올겁니다 좀만 참고 기다려보세요..
물론 안 쓸수도 있구요!

## 컨텍스트 없는 '부분 적용'
인수 일부는 고정하고 컨텍스트 `this`는 고정하고 싶지 않다?
어떻게 해야 할까요..?

네이티브 `bind`만으로는 컨텍스트를 생략하고 인수로 바로 뛰어넘지 못합니다.

하지만 다행히도 인수만 바인딩해주는 헬퍼 함수를 구현하면 됩니다.

```js
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}
```
```js
// 사용법:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// 시간을 고정한 부분 메서드를 추가함
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hello");
// 출력값 예시:
// [10:00] John: Hello!
```

`partial(func[, arg1, arg2...])`을 호출하면 래퍼`(*)`가 반환됩니다.
래퍼를 호출하면 `func`이 다음과 같은 방시긍로 동작합니다.

- 동일한 this를 받습니다(user.sayNow는 user를 대상으로 호출됩니다).
- partial을 호출할 때 받은 인수("10:00")는 ...argsBound에 전달됩니다.
- 래퍼에 전달된 인수("Hello")는 ...args가 됩니다.

lodash 라이브러리의 [_.partial](https://lodash.com/docs#partial)을 사용하면 위와 같이 직접 구현하지 않아도 됩니다.