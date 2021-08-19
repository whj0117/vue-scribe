## 组件安装
```
npm i vue-scribe / yarn add vue-scribe
```

## 如何使用组件
```
全局全局

import Vue from 'vue'
import vueScribe from "vue-scribe"
Vue.use(vueScribe)

局部

import vueScribe from "vue-scribe"
componetns:{vueScribe}

组件位置
<vue-scribe :options="{}" />
```

## 配置项
```
      config: {
        /**
         * @description text content
         * @type {String}
         * @default text = '我是一段文本我是一段文本我是一段文本我是一段文本我是一段文本我是一段文本'
         */
        text: '我是一段文本我是一段文本我是一段文本我是一段文本我是一段文本我是一段文本',
        /**
         * @description underline color
         * @type {String}
         * @default lineColor = '#000'
         */
        lineColor: '#000',
        /**
         * @description underline width
         * @type {String|Number}
         * @default lineWidth = 1
         */
        lineWidth: 1,
        /**
         * @description set underline button background color
         * @type {String}
         * @default btnBgColor = 'rgba(0,0,0,.6)'
         */
        btnBgColor: 'rgba(0,0,0,.6)',
        /**
         * @description set underline button font color
         * @type {String}
         * @default btnTextColor = '#fff'
         */
        btnTextColor: '#fff',
        /**
         * @description set underline button font size
         * @type {String|Number}
         * @default btnTextSize = 16
         */
        btnTextSize: 16,
      }
```

[参考地址](https://www.cnblogs.com/wanglinmantan/p/15106871.html)
```
https://www.cnblogs.com/wanglinmantan/p/15106871.html
```


