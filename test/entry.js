function test() {
    console.log(111);
}

const workerUrl = 'https://webgame.vrviu.com/lightplay/static-resource/sdk/publish/lightplay_h5_sdk_v2.63/default-logger.worker.js?t=1649649264473'

const decodeBlob = new Blob(
    [`importScripts("${workerUrl}?t=${Date.now()}")`],
    { type: 'application/javascript' }
);

const decoderScript = window.URL.createObjectURL(decodeBlob);

const w = new Worker(decoderScript);

// const data = {
//     a: 1,
//     b: 2,
//     c: {
//         a: 1,
//         b: 2
//     },
//     d: {
//         a: 1,
//         b: 2,
//         c: {
//             a: 1,
//             b: 2
//         }
//     }
// }

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