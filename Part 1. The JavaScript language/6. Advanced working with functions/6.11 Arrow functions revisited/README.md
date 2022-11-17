# [화살표 함수 다시 살펴보기](https://ko.javascript.info/arrow-functions)

> <잠깐만요!> 화살표 함수를 왜 다시 살펴 보나요..??

- 화살표 함수는 단순히 `짧게` 쓰기 위한 용도가 아님을 알려드리기 위해서 입니다.

- 화살표 함수는 몇 가지 독특하고 유용한 기능을 제공합니다.

#### 자바스크립트를 사용하다 보면 저 멀리 동떨어진 곳에서 실행될 작은 함수를 작성해야 하는 상황을 자주 만나게 됩니다.

```js
arr.forEach(func) // func는 forEach가 호출될 때 배열 arr의 요소 전체를 대상으로 실행됩니다.
setTimeout(func) // func는 내장 스케줄러에 의해 실행됩니다.
```

- 이처럼 자바스크립트에선 함수를 생성하고 그 함수를 어딘가에 전달하는 것이 아주 자연스럽습니다.

- 그런데 어딘가에 함수를 전달하게 되면 함수의 컨텍스트를 잃을 수 있습니다. 
  - 이럴 때 화살표 함수를 사용하면 현재 컨텍스트를 잃지 않아 편리합니다.

---

## 화살표 함수에는 'this’가 없습니다

- [4.4 메서드와 this](https://ko.javascript.info/object-methods) 챕터에서 화살표 함수엔 `this`가 없다는 것을 배운 바 있습니다.
  - 화살표 함수 본문에서 `this`에 접근하면, 외부에서 값을 가져옵니다.

- 이런 특징은 객처의 메서드(`showList()`) 안에서 동일 객체의 프로퍼티(`students`)를 대상으로 순회를 하는데 사용할 수 있습니다.

```js
let group = {
  title: "1모둠",
  students: ["보라", "호진", "지민"],

  showList() {
    this.students.forEach( // (*)
      student => alert(this.title + ': ' + student)
    );
  }
};

group.showList();
```

- 예시의 `forEach`에서 화살표 함수를 사용했기 때문에 화살표 함수 본문에 있는 `this.title`은 화살표 함수 바깥에 있는 메서드인 `showList`가 가리키는 대상과 동일해집니다.
  - 즉 `this.title`은 `group.title`과 같습니다.

```js
let group = {
  title: "1모둠",
  students: ["보라", "호진", "지민"],

  showList() {
    this.students.forEach(function(student) { // (*)
      // TypeError: Cannot read property 'title' of undefined
      alert(this.title + ': ' + student)
    });
  }
};

group.showList();
```

- 에러는 `forEach`에 전달되는 함수의 `this`가 `undefined` 이기 때문에 발생했습니다.
  - `alert` 함수에서 `undefined.title`에 접근하려 했기 때문에 얼럿 창엔 에러가 출력됩니다.

- 그런데 화살표 함수는 `this` 자체가 없기 때문에 이러한 에러가 발생하지 않습니다.

## 화살표 함수엔 `arguments`가 없습니다.

- 화살표 함수는 일반 함수와는 다르게 모든 인수에 접근할 수 있게 해주는 유사 배열 객체 `arguments`를 지원하지 않습니다.

- 이런 특징은 현재 `this` 값과 `arguments` 정보를 함께 실어 호출을 포워딩 해주는 *데코레이터를 만들 때 유용하게 사용*됩니다.

- 아래 예시에서 데코레이터 `defer(f, ms)`는 함수를 인자로 받고 이 함수를 래퍼로 감싸 반환하는데, 함수 `f`는 `ms` 밀리초 후에 호출됩니다.

```js
function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms)
  };
}

function sayHi(who) {
  alert('안녕, ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("철수"); // 2초 후 "안녕, 철수"가 출력됩니다.
```

- 화살표 함수를 사용하지 않고 동일한 기능을 하는 데코레이터 함수를 만들면 다음과 같습니다.

```js
function defer(f, ms) {
  return function(...args) {
    let ctx = this;
    setTimeout(function() {
      return f.apply(ctx, args);
    }, ms);
  };
}
```

- 일반 함수에선 `setTimeout`에 넘겨주는 콜백 함수에서 사용할 변수 `ctx`와 `args`를 반드시 만들어줘야 합니다.

## 요약

#### 화살표 함수가 일반 함수와 다른 점은 다음과 같습니다.

- `this`를 가지지 않습니다.
- `arguments`를 지원하지 않습니다.
- `new`와 함께 호출할 수 없습니다.
- 이 외에도 화살표 함수는 `super`가 없다는 것이 특징인데 아직 `super`에 대해 배우지 않았기 때문에 이번 챕터에서는 다루지 않았습니다.
  - 화살표 함수와 `super`의 관계는 [9.2 클래스 상속](https://ko.javascript.info/class-inheritance) 챕터에서 학습할 예정입니다.

#### 화살표 함수는 컨텍스트가 있는 긴 코드보다는 자체 *컨텍스트*가 없는 짧은 코드를 담을 용도로 만들어졌습니다. 그리고 이 목적에 잘 들어맞는 특징을 보입니다.