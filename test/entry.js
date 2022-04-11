function test() {
    console.log(111);
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

test();
objectCall();
jsonCall();