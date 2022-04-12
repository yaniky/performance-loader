function test() {
    console.log(111);
    typeof b
}

const w = new Worker(new URL('./worker.js', import.meta.url));

function objectCall() {
    for (let i = 0; i < 50000; i++) {
        w.postMessage({
            a: 1,
            b: 2,
            c: {
                a: 1,
                b: 2
            },
            d: {
                a: 1,
                b: 2,
                c: {
                    a: 1,
                    b: 2
                },
                b: 2,
                c: {
                    a: 1,
                    b: 2
                },
                d: {
                    a: 1,
                    b: 2,
                    c: {
                        a: 1,
                        b: 2
                    }
                }
            }
        })
    }
}

function jsonCall() {
    for (let i = 0; i < 50000; i++) {
        w.postMessage(JSON.stringify({
            a: 1,
            b: 2,
            c: {
                a: 1,
                b: 2
            },
            d: {
                a: 1,
                b: 2,
                c: {
                    a: 1,
                    b: 2
                },
                b: 2,
                c: {
                    a: 1,
                    b: 2
                },
                d: {
                    a: 1,
                    b: 2,
                    c: {
                        a: 1,
                        b: 2
                    }
                }
            }
        }))
    }
}

function proFunc() {
    return new Promise(resolve => {
        console.log("resolve");
        setTimeout(() => {
            test();
        }, 1000);
        resolve(true);
    }).then(res => {
        console.log('then');
    }).catch(e => {
        console.log(e);
    });
}

async function asyFunc() {
    await proFunc();
}

function returnFunc() {
    const a = "aa";
    return a;
}

test();
objectCall();
jsonCall();