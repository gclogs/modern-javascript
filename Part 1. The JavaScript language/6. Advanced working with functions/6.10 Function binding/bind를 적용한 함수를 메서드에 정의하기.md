# 1. bind를 적용한 함수를 메서드에 정의하기 (Bound function as a method)

> 중요도: 5

##### Q. 아래 코드를 실행하면 어떤 결과가 나올까요?

```js
function f() {
  alert( this ); // ?
}

let user = {
  g: f.bind(null)
};

user.g();
```

정답은 `null` 입니다.

`bind`를 적용한 함수의 컨텍스트는 완전히 고정됩니다.

한번 고정되면 바꿀 방법이 없습니다.

따라서 `user.g()`를 실행했음에도 불구하고 기존 함수의 컨텍스트는 `null`이 되기 때문에 `null`이 출력됩니다.