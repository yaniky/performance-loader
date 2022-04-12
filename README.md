# 使用说明

## 添加loader

```js
{
    test: /\.(j|t)s$/,
    use: [
        {
            loader: path.resolve(__dirname, "./index.js"),
            options: {
                performanceTime: 500
            },
        }
    ]
}
```

## 效果

打包后为每个function添加耗时统计，如下：

```js
function test() {
    console.log(111);
}
```

打包后代码

```js
function test() {
  const LOADER_START_PERFORMANCE_TIME = performance.now();
  {
    console.log(111);
  }
  const LOADER_END_PERFORMANCE_TIME = performance.now();
  const LOADER_PERFORMANCE_TIME_USE = LOADER_END_PERFORMANCE_TIME - LOADER_START_PERFORMANCE_TIME;
  if (LOADER_PERFORMANCE_TIME_USE > 500) console.warn("test 0: use to long time => " + LOADER_PERFORMANCE_TIME_USE);
}
```
