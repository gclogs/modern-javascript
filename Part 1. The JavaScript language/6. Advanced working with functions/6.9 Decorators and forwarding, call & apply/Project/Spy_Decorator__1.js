/**
 * Create a decorator spy(func) that should return a wrapper that saves all calls to function in its calls property.
 * Every call is saved as an array of arguments.
 */

function work(a, b) {
    alert( a + b );
}

work = spy(work);

work(1, 2);
work(4, 5);


for( args of work.calls) {
    alert( 'call: ' + args.join() );
}

function spy(func) {
    let cache = new Map();
    return function() {
        let key = hash(arguments);
        if(cache.has(key)) {
            cache.get(key);
        }

        let result = func.apply(this, arguments);

        cache.set(this, result);
        return result;
    }
}
// 정답
function spy(func) {
    function wrapper(...args) {
        wrapper.calls.push(args);
        return func.apply(this, args);
    }

    wrapper.calls = [];

    return wrapper;
}