function slow(x) {
    // there can be a heavy CPU-intensive job here.
    alert(`Called with ${x}`);
    return x;
}

function cachingDecorator(func) {
    let cache = new Map();

    return function(x) {
        if (cache.has(x)) {      // if there's such key in cache
            return cache.get(x); // read the result from it
        }

        let result = func(x);   // otherwise call func

        cache.set(x, result);   // and cache (remember) the result
        return result;
    };
}

slow = cachingDecorator(slow);

alert( slow(1) );
alert( "Again: " + slow(1) );

alert( slow(2) );
alert( "Again: " + slow(2) );

/**
 * 독립된 래퍼 함수 cachingDecorator 를 사용할때 생기는 이점
 * 
 * cachingDecorator를 재사용 할 수 있습니다. 원하는 함수 어디에든 cachingDecorator를 적용할 수 있습니다.
 * 캐싱 로직이 분리되어 slow 자체의 복잡성이 증가하지 않습니다.
 * 필요하다면 여러 개의 데코레이터를 조합해서 사용할 수도 있습니다(추가 데코레이터는 cachingDecorator 뒤를 따릅니다).
 */