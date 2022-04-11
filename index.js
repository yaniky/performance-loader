const parser = require("@babel/parser");
const traverse = require("babel-traverse").default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const startPerformanceTimeName = "LOADER_START_PERFORMANCE_TIME";
const endPerformanceTimeName = "LOADER_END_PERFORMANCE_TIME";

const PerformaceLoader = function(source) {
    const options = {
        performanceTime: 1000,
        ...this.query
    }

    let ast = parser.parse(source, {
        sourceType: "module",
        plugins: ["dynamicImport", "jsx","classProperties"],
    });

    traverse(ast, {
        FunctionDeclaration(path) {
            const node = path.node;

            if (node.body) {
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
                        t.identifier('performanceTimeUse'),
                        t.binaryExpression("-", t.identifier(endPerformanceTimeName), t.identifier(startPerformanceTimeName))
                    )
                ]);

                const ifToLongTime = t.ifStatement(
                    t.binaryExpression(
                        ">",
                        t.identifier("performanceTimeUse"),
                        t.numericLiteral(options.performanceTime)
                    ),
                    t.expressionStatement(
                        t.callExpression(
                            t.identifier('console.warn'),
                            [
                                t.binaryExpression(
                                    "+",
                                    t.stringLiteral(`${ node.id.name }: use to long time => `),
                                    t.identifier('performanceTimeUse')
                                )
                            ]
                        )
                    )
                )

                const newBody = t.blockStatement([startNode, node.body, endNode, computed, ifToLongTime])

                node.body = newBody;
            }
        }
    });

    const {code} = generate(ast, {}, source);

    return code;
};

module.exports = PerformaceLoader;