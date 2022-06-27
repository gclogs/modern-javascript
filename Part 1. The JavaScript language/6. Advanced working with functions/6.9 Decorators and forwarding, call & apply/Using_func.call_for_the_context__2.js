// we'll make worker.slow caching
let worker = {
    someMethod() {
        return;
    },

    slow(x) {
        // scary CPU-heavy task here
        alert("Called with " + x);
        return x * this.someMethod(); // (*)
    }
};

// same code as before
function cachingDecorator(func) {
    let cache = new Map();
    return function(x) {
        if(cache.has(x)) {
            return cache.get(x);
        }
        // let result = func(x); // (**)
        /**
         * 명확한 이해를 위해 this가 어떤 과정을 거쳐 전달되는지 자세히 살펴보겠습니다.
         * 
         * 데코레이터를 적용한 후에 worker.slow는 래퍼 function (x) { ... }가 됩니다.
         * worker.slow(2)를 실행하면 래퍼는 2를 인수로 받고, this=worker가 됩니다(점 앞의 객체).
         * 결과가 캐시되지 않은 상황이라면 func.call(this, x)에서 현재 this (=worker)와 인수(=2)를 원본 메서드에 전달합니다.
         */
        let result = func.call(this, x); // "this" is passed correctly now
        cache.set(x, result);
        return result;
    };
}

alert( worker.slow(1) );    // the original method works

worker.slow = cachingDecorator(worker.slow);    // now make it caching

alert( worker.slow(2) );    // Whoops! Error: Cannot read property 'someMethod' of undefined.