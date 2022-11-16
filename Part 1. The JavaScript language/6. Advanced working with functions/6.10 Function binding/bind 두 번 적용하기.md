# 2. bind 두 번 적용하기 (Second bind)

#### Q. 함수에 bind를 적용하고, 이어서 한 번 더 bind를 적용하면 this를 바꿀 수 있을까요?

#### Q2. 아래 코드를 실행하면 어떤 결과가 나올까요?

```js
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
```

정답은 **John** 입니다.

`f.bind(...)` 가 반환한 특수 객체인 묶인 함수는 함수 생성 시점의 컨텍스트만 기억합니다.

인수가 제공되었다면 그 인수 또한 기억합니다.

##### 한번 `bind`를 적용하면 `bind`를 또 사용해 컨텍스트를 다시 정의할 수 없습니다.