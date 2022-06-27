let worker = {
    slow(max, min) {
        alert(`Called with slow(${max}, ${min}`);
        return min + max;
    }
}

function cachingDecorator(func, hash) {
    let cache = new Map();
    return function() {
        let key = hash(arguments);
        if(cache.has(key)) {
            return cache.get(key);
        }

        let result = func.apply(this, arguments);

        cache.set(key, result);
        return result;
    }
}

function hash() {
    return [].join.call(arguments);
}