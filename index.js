const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const startPerformanceTimeName = "LOADER_START_PERFORMANCE_TIME";
const endPerformanceTimeName = "LOADER_END_PERFORMANCE_TIME";
const performanceTimeUseName = "LOADER_PERFORMANCE_TIME_USE";

let returnIndex = 0;

let funcIndex = 0;

let options = {
    performanceTime: 1000
}

function getParentId(path) {
    if (path.node && path.node.id) {
        return path.node.id.name;
    }

    if (path.parentPath) {
        return getParentId(path.parentPath);
    }

    return path.start;
}

function appendPerformanceCode(path) {
    const node = path.node;

    if (!node.async && node.body) {
        const startNode = t.variableDeclaration("const", [
            t.variableDeclarator(
                t.identifier(startPerformanceTimeName), 
                t.callExpression(
                    t.identifier('performance.now'),
                    []
                )
            )
        ]);

        const endNode = t.variableDeclaration("const", [
            t.variableDeclarator(
                t.identifier(endPerformanceTimeName),
                t.callExpression(
                    t.identifier('performance.now'),
                    []
                )
            )
        ]);

        const computed = t.variableDeclaration("const", [
            t.variableDeclarator(
                t.identifier(performanceTimeUseName),
                t.binaryExpression("-", t.identifier(endPerformanceTimeName), t.identifier(startPerformanceTimeName))
            )
        ]);

        const ifToLongTime = t.ifStatement(
            t.binaryExpression(
                ">",
                t.identifier(performanceTimeUseName),
                t.numericLiteral(options.performanceTime)
            ),
            t.expressionStatement(
                t.callExpression(
                    t.identifier('console.warn'),
                    [
                        t.binaryExpression(
                            "+",
                            t.stringLiteral(`${ getParentId(path) } ${funcIndex++}: use to long time => `),
                            t.identifier(performanceTimeUseName)
                        )
                    ]
                )
            )
        )

        let nowBody = [];

        if (node.body.type !== "BlockStatement") {
            nowBody = [t.expressionStatement(
                node.body
            )];
        } else {
            nowBody = node.body.body;
        }

        const newBody = t.blockStatement([startNode].concat(nowBody).concat([endNode, computed, ifToLongTime]))

        node.body = newBody;
    }
}

function appendBeforeReturn(path) {
    const parentName = getParentId(path);

    const nowEndTimeName = `${endPerformanceTimeName}_${returnIndex}`;
    const nowUseTimeName = `${performanceTimeUseName}_${returnIndex}`;
    
    const ifToLongTime = t.ifStatement(
        t.binaryExpression(
            "===",
            t.unaryExpression("typeof", t.identifier(startPerformanceTimeName)),
            t.stringLiteral("number")
        ),
        t.blockStatement(
            [
                t.variableDeclaration("const", [
                    t.variableDeclarator(
                        t.identifier(nowEndTimeName),
                        t.callExpression(
                            t.identifier('performance.now'),
                            []
                        )
                    )
                ]),
                t.variableDeclaration("const", [
                    t.variableDeclarator(
                        t.identifier(nowUseTimeName),
                        t.binaryExpression("-", t.identifier(nowEndTimeName), t.identifier(startPerformanceTimeName))
                    )
                ]),
                t.ifStatement(
                    t.binaryExpression(
                        ">",
                        t.identifier(nowUseTimeName),
                        t.numericLiteral(options.performanceTime)
                    ),
                    t.expressionStatement(
                        t.callExpression(
                            t.identifier('console.warn'),
                            [
                                t.binaryExpression(
                                    "+",
                                    t.stringLiteral(`${parentName}: return ${returnIndex} use to long time => `),
                                    t.identifier(nowUseTimeName)
                                )
                            ]
                        )
                    )
                )
            ]
        )
    );

    returnIndex++

    path.insertBefore(ifToLongTime);
}

const PerformaceLoader = function(source) {
    options = {
        ...options,
        ...this.query
    }

    let ast = parser.parse(source, {
        sourceType: "module",
        plugins: ["dynamicImport", "jsx","classProperties"],
    });

    traverse(ast, {
        ArrowFunctionExpression(path) {
            appendPerformanceCode(path);
        },
        FunctionDeclaration(path) {
            appendPerformanceCode(path);
        },
        FunctionExpression(path) {
            appendPerformanceCode(path);
        },
        ReturnStatement(path) {
            appendBeforeReturn(path);
        }
    });

    const {code} = generate(ast, {}, source);

    return code;
};

module.exports = PerformaceLoader;