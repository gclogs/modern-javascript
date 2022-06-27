/**
 * Create a decorator delay(f, ms) that delays each call of f by ms milliseconds.
 */

function f(x) {
    alert(x);
}

function dealy(f, ms) {
    function wrapper() {
        
    }
}

let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000("test");
f1500("test");