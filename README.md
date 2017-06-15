# ReUp
a tool library for operate JavaScript object and array,make it easier to update or remove some part of it.

it will return a new object or array, so you can strictly use return value for reducer.

一个操作更新数组和对象的工具库，通过简洁的语法实现对复杂嵌套的对象和数组更方便的更新或移除操作。

返回值是全新的对象，所以可以直接用于类似于redux等库的reducer中。


[![build status](https://travis-ci.org/daskyrk/ReUp.svg?branch=master)](https://travis-ci.org/daskyrk/ReUp)


#### Usage

##### update grammar：

```javascript
update(object|array, 'path{@tag}/to/target', targetShape)
  .when(filterObject)
  .to(($tag, targets)=>{
    // change to what you want
  })
  .val();
```

##### testObj：

```javascript
const testObj = {
  arr: [
    {
      text: 'arr1',
      age: 1,
      sub: {
        name: 'obj1Name',
        extra: false,
      },
    },
    {
      text: 'arr2',
      age: 1,
      sub: {
        name: 'obj2Name',
        extra: true,
      },
    },
  ],
  obj: {
    obj_arr: [
      {
        obj_arr1: 'hhh',
      },
      {
        obj_arr2: 'ggg',
      },
      {
        obj_arr3: 'fff',
        isYou: true,
      },
      'problem',
    ],
    love: 'you',
    like: 'me',
  },
  base: 'outerBase',
};
```

##### demos:

```javascript
// add attribute `add` to testObj.arr[0]
// arr属性下第一个对象加了add属性
update(testObj, 'arr.0', { add: 'hello' }).val();
```

```javascript
// update testObj.arr[0].sub.name to 'hello'
// arr属性下第一个sub.name改为hello
update(testObj, 'arr.0.sub', { name: 'hello' }).val();
```

```javascript
// update all children's age to 'hello' of testObj.arr which text='arr2'
// arr下text=arr2的对象age都改为hello
update(testObj, 'arr.@child', { age: 'hello' }).when({ text: 'arr2' }).val()
```

```javascript
// update the first object in arr to 'hello'
// arr下第一个对象改为 hello字符串
update(testObj, 'arr.0', 'hello').val()
```

##### testArray:

```javascript
const testArr = [
  {
    text: 'arr1',
    age: 1,
    sub: {
      name: 'obj1Name',
      extra: false,
      subArr: [
        {
          subText: 'sub1',
          status: 'run',
        },
        {
          subText: 'sub2',
          status: 'run',
        },
        {
          subText: 'sub3',
          status: 'run',
        },
      ],
    },
    arr: [[1, 2, 3], [4, 5, 6]],
  },
  {
    text: 'arr2',
    age: 2,
    sub: {
      name: 'obj2Name',
      extra: true,
      subArr: [
        {
          subText: 'sub1',
          status: 'run',
        },
        {
          subText: 'sub2',
          status: 'run',
        },
        {
          subText: 'sub3',
          status: 'run',
        },
      ],
    },
    arr: [[1, 2, 3], [4, 5, 6]],
  },
  {
    text: 'arr3',
    age: 3,
    sub: {
      name: 'obj3Name',
      extra: true,
      subArr: [
        {
          subText: 'sub1',
          status: 'run',
        },
        {
          subText: 'sub2',
          status: 'run',
        },
        {
          subText: 'sub3',
          status: 'stop',
        },
      ],
    },
    hide: '2333',
    arr: [[1, 2, 3], [4, 5, 6]],
  },
];
```

##### demos:

```javascript
// update testArr[1].age to 222
// arr中第二个对象age改为222
update(testArr, '1', { age: 222 }).val();
```

```javascript
// update some itme's status to 'done' in subArr by multi level filter
// arr中text为arr2的对象下sub.subArr中subText=sub1对象的status改为done
update(testArr, '@child{$parent}.sub.subArr.@child{$sub}', { status: 'done' })
  .when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } })
  .val();
```

```javascript
// same to prev demo but use `to` function
// 效果同上一个例子但使用to方法
update(testArr, '@child{$parent}.sub.subArr.@child{$sub}')
  .when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } })
  .to((parents, subs) => {
    subs.forEach((sub) => {
      sub.status = 'done';
    });
  }).val();
```

```javascript
// update sub obj when parent.age is 3
// arr中age为3的对象下的sub.extra改为false，subArr长度改为1
update(testArr, '@child{$parent}.sub')
  .when({ $parent: { age: 3 } })
  .to((parents, subs) => {
    subs.forEach((sub) => {
      sub.extra = false;
      sub.subArr.length = 1;
    });
  }).val();
```

```javascript
// remove 6 from arr includes 5 and parent.hide is not undefined
// 有hide属性的arr中包含5的数组移除6
update(testArr, '@child{$parent}.arr.@child')
  .when({ $parent: 'hide' })
  .to((parent, arrs) => {
  arrs.forEach((arr) => {
    if (arr.includes(5)) {
      _.pull(arr, 6);
    }
  });
}).val();
```

---

##### remove grammar：

```javascript
remove(object|array, 'path{@tag}/to/target', removeFilter)
  .when(filterObject)
  .val();
```

##### demos(array):

```javascript
// remove first item in testArr
// 移除arr中第一项
remove(testArr, '1').val();
```

```javascript
// remove obj in arr when obj.hide='2333'
// 移除arr中hide属性为2333的项
remove(testArr, '', { hide: '2333' }).val();
```

```javascript
// remove all item's hide attribute in testArr
// 移除arr下所有对象的hide属性
remove(testArr, '@child', ['hide']).when({ age: 3 }).val();
```

```javascript
// remove all item's status attribute in all subArr
// 移除arr.sub.subArr下所有对象的status属性
remove(testArr, '@child.sub.subArr.@child', ['status']).val();
```

##### demos(object):

```javascript
// remove root attribute `base`
// 移除根级属性base
remove(testObj, '', ['base']).val();
```

```javascript
// remove testObj.obj.obj_arr[3]
// 移除obj.obj_arr里的第4项 problem
remove(testObj, 'obj.obj_arr.3').val();
```

```javascript
// remove obj in obj_arr which isYou=true
// 移除obj.obj_arr里isYou为true的对象
remove(testObj, 'obj.obj_arr', { isYou: true }).val();
```



**please see test cases for more demo usage**



#### Todo：

- [ ] 增加remove时的toFn，方便实现父子级依赖判断时的操作
- [ ] 梳理api，调整优化部分逻辑
- [ ] 考虑是否增加select？
- [ ] 覆盖其他还没测试到的地方
