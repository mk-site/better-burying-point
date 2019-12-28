### Introduction
1、埋点业务与主业务进行解耦（代码分离），依赖装饰器实现

2、埋点after方法，在主程序执行完毕后，在执行@after装饰的方法

## Installation
```shell
# for Vue Angular React

npm i better-burying-point -S
```


## Usage

##### 使用：
```js
import { setModule, setSeparator, before, after } from 'better-burying-point';
```

##### 用法一：
```js
// main.js
import { setModule } from 'better-burying-point';
// 设置模块
setModule({
    home: {
        homePage(item, index) {
            console.log(this); // 与handlerEvent函数内部的this指向相同
        },
        clickBtn(staticParamOne, staticParamTwo, item, index) {},
        leave(staticParamOne, staticParamTwo, item, index) {}
    }
})

// home.js
import { before, after } from 'better-burying-point';
const obj = {
    @after('home.homePage')
    handlerEvent(item, index){
        console.log(this);
    },
    @after('home.clickBtn', staticParamOne, staticParamTwo) // 此处两个静态参数会与clickBtn函数的参数进行拼装，传递到home模块下clickBtn函数内
    clickBtn(item, index){
        console.log('点击');
    },
    @before('home.leave', staticParamOne, staticParamTwo)
    goLink() {
        window.loation.href = 'https://xxx.com.cn';
    }
}

```

##### 用法二：按照模块化拆分 

```js
// bury/modules/home.js
export default {
    homePage(item, index) {
        console.log(this);
    }
}
// bury/modules/detail.js
export default {
    detailPage(item, index) {
        console.log(this);
    }
}
// bury/index.js
import home from './modules/home.js';
import detail from './modules/detail.js';
export default {
    home,
    detail
}

// 入口文件处设置 main.js
import { setModule } from 'better-burying-point';
import module from './bury/index';
setModule(module);


// home页面 使用
var home = {
    @after('home.homePage')
    handlerEvent(item, index){
        console.log(this);
    }
}
```


## Options

#### setModule
`Type: Function[Object]`    
设置拆分模块的对象，为页面访问使用,函数参数为对象

#### setSeparator
`Type: Function[String]`    
`Default: '.'`     
设置对象访问分隔符，函数参数为字符串，比如：home.leave；如果设置'/',访问home/leave

#### before
`Type: Function[arg1 , arg2, arg3, ...]`        
before函数返回一个装饰器函数    
第一个参数：必须为字符串，模块访问顺序
第二个参数：静态参数
...
第n个参数：静态参数     
【 备注：】主程序执行之前才执行装饰函数

#### after
`Type: Function[arg1 , arg2, arg3, ...]`   
after函数返回一个装饰器函数    
第一个参数：必须为字符串，模块访问顺序
第二个参数：静态参数
...
第n个参数：静态参数     
【 备注：】主程序执行之后才执行装饰函数


## License
MIT
