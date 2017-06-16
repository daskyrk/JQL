
### Todo：

- [ ] 增加remove时的toFn，方便实现父子级依赖判断时的操作
- [ ] 梳理api，调整优化部分逻辑
- [ ] 考虑是否增加select？
- [ ] 覆盖其他还没测试到的地方





### 对比[updeep](https://github.com/substantial/updeep)：

updeep的思路不错，将更新的位置分开处理，可以同时对多个地方进行更新，而我的这种方式则需要写多次的update语句，否则只是提供tag与目标位置的映射，实际意义不是很大，因为具体的处理逻辑还是自己写的。

#### updeep官网例子：

```javascript
var u = require('updeep');

var person = {
  name: { first: 'Bill', last: 'Sagat' },
  children: [
    { name: 'Mary-Kate', age: 7 },
    { name: 'Ashley', age: 7 }
  ],
  todo: [
    'Be funny',
    'Manage household'
  ],
  email: 'bill@example.com',
  version: 1
};

var inc = function(i) { return i + 1; }
var eq = function(x) { return function(y) { return x == y } };

var newPerson = u({
  // Change first name
  name: { first: 'Bob' },
  // Increment all children's ages
  children: u.map({ age: inc }),
  // Update email
  email: 'bob@example.com',
  // Remove todo
  todo: u.reject(eq('Be funny')),
  // Increment version
  version: inc
}, person);
// => {
//  name: { first: 'Bob', last: 'Sagat' },
//  children: [
//    { name: 'Mary-Kate', age: 8 },
//    { name: 'Ashley', age: 8 }
//  ],
//  todo: [
//    'Manage household'
//  ],
//  email: 'bob@example.com',
//  version: 2
//}

result = update(person, 'name.first', 'Bob').val();
result = update(result, 'email', 'bob@example.com').val();
result = update(result, 'children.*.age', 8).val();
result = remove(result, 'todo.0').val();
// result = update(person, 'name', 'Bob')
//         .update(person, 'email', 'bob@example.com')
//         .update(person, 'children.*.age', 8)
//         .remove(person, 'todo.0').val()
//         .val();
```



#### 比较：

1. ##### 我的方式不够方便直观，而且还没有实现链式调用

因为考虑到when和to等函数的后续调用，所以实际update、remove是放在val中一次处理，如果改为链式调用，就需要把每次的更新记录在数组中，最后一起映射到目标上，但这样就非常麻烦而且可能有些问题无法解决，比如前一次操作和后一次操作相互间影响。而且，由于我有when和to，写成`update().when().to().update().when().to().val()`形式就非常怪异了。

2. ##### 没有实现对局部方便的使用函数更新

尽管我提供了tag标记来方便操作特定位置的数据，但这个标记只能打在一条路径的父级上，所以不能多条路径同时更新。

我把路径上的父级和目标放在一个函数的参数里，可以通过when和to方法，实现根据父级属性不同调整目标的功能，这是一个优点，不过却需要使用者自己注意不能随意修改父级，这是个缺点。(可以考虑冻结父级？)

```javascript
// Update person's last name to Simpson if their first name is Jen
var result = u({
  person: u.if(
    u.is('name.first', 'Jen'),
    u.updateIn('name.last', 'Simpson')
  )
}, person);
```

updeep也有类似的方式根据其他地方的属性来处理目标属性

3. ##### 替换还是更新

我替换时是根据类似是否一致，一致就合并，而updeep是使用function（`constant`）返回替换对象

我的方式有点类似updeep里的updateIn方法，使用路径来更新特定值，使用`*`代替`@child`也是借鉴updeep里的

4. ##### 判断逻辑很多，其实用户会知道自己操作的类型

提供了一些`_.omit`、`_.reject`,`_.omitBy`等方法对object和array使用不同的方法处理，而我是约定了一些写法，比如传数组是移除属性列，字符串是移除属性等，导致内部做的判断很多，需要兼顾各种情况。