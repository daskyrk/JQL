import test from 'ava';
import chain from '../src/core';
import _ from 'lodash';

function update(...args) {
  const chainCopy = { ...chain };
  return chainCopy.update(...args);
}
function remove(...args) {
  const chainCopy = { ...chain };
  return chainCopy.remove(...args);
}

const fuzaObj = {
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
      '乱入',
    ],
    love: 'you',
    like: 'me',
  },
  base: 'outerBase',
};
const fuzaArr = [
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
    age: 1,
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
          status: 'run',
        },
      ],
    },
    hide: '2333',
    arr: [[1, 2, 3], [4, 5, 6]],
  },
];

function getFuzaObj() {
  return _.cloneDeep(fuzaObj);
}

function getFuzaArr() {
  return _.cloneDeep(fuzaArr);
}

const c = _.cloneDeep;

// object
// update
let result = null;
test('arr下第一个对象加了add属性', (t) => {
  result = update(getFuzaObj(), 'arr.0', { add: 'hello' }).val();
  t.is(result.arr[0].add, 'hello');
  t.snapshot(result);
});

test('arr下第一个sub name改为hello', (t) => {
  result = update(getFuzaObj(), 'arr.0.sub', { name: 'hello' }).val();
  t.is(result.arr[0].sub.name, 'hello');
  t.snapshot(result);
});

test('arr下所有的sub name都改为hello', (t) => {
  result = update(getFuzaObj(), 'arr.@child.sub', { name: 'hello' }).val();
  result.arr.forEach(({ sub }) => {
    t.is(sub.name, 'hello');
  });
  t.snapshot(result);
});

test('arr下第一个对象改为 hello', (t) => {
  result = update(getFuzaObj(), 'arr.0', 'hello').val();
  t.is(result.arr[0], 'hello');
  t.snapshot(result);
});

test('obj下的obj_arr数组改为 hello', (t) => {
  result = update(getFuzaObj(), 'obj.obj_arr', 'hello').val();
  t.is(result.obj.obj_arr, 'hello');
  t.snapshot(result);
});

test('obj下新增test属性为 hello', (t) => {
  result = update(getFuzaObj(), 'obj.test', 'hello').val();
  t.is(result.obj.test, 'hello');
  t.snapshot(result);
});

test('obj下新增test.hh属性为 hello 会报错', (t) => {
  const error = t.throws(() => {
    result = update(getFuzaObj(), 'obj.test.hh', 'hello').val();
  }, TypeError);
  t.is(error.message, 'Cannot set property \'hh\' of undefined');
});

test('根级属性base改为 hello', (t) => {
  result = update(getFuzaObj(), 'base', 'hello').val();
  t.is(result.base, 'hello');
  t.snapshot(result);
});


// remove
test('移除根级属性base', (t) => {
  result = remove(getFuzaObj(), '', ['base']).val();
  t.is(result.base, undefined);
  t.snapshot(result);
});

test('移除obj.love obj.like两个属性', (t) => {
  result = remove(getFuzaObj(), 'obj', ['love', 'like']).val();
  t.is(result.obj.love, undefined);
  t.is(result.obj.like, undefined);
  t.snapshot(result);
});

test('移除obj.obj_arr里的第4项 ’乱入‘', (t) => {
  result = remove(getFuzaObj(), 'obj.obj_arr.3').val();
  t.is(result.obj.obj_arr.length, 3);
  t.falsy(result.obj.obj_arr.includes('乱入'));
  t.snapshot(result);
});

// todo
// test('移除obj.obj_arr里的 ’乱入‘', (t) => {
//   result = remove(getFuzaObj(), 'obj.obj_arr.3', '乱入').val();
//   t.is(result.obj.obj_arr.length, 3);
//   t.falsy(result.obj.obj_arr.includes('乱入'));
//   t.snapshot(result);
// });

test('移除obj.obj_arr里isYou为true的', (t) => {
  result = remove(getFuzaObj(), 'obj.obj_arr', { isYou: true }).val();
  t.falsy(_.find(result.obj.obj_arr, { isYou: true }));
  t.snapshot(result);
});

test('移除obj.obj_arr里无匹配的', (t) => {
  result = remove(getFuzaObj(), 'obj.obj_arr', { isYou: true, notExist: true }).val();
  const length = result.obj.obj_arr.length;
  t.is(length, 4);
  t.is(result.obj.obj_arr[length - 1], '乱入');
  t.snapshot(result);
});

// todo: add @key

// array

// const nr1 = update(getFuzaArr(), 'base', 'hello').val();
// output('nr1 根级属性base改为hello :', nr1);
// const nr2 = update(getFuzaArr(), '1', {age: 2}).val();
// output('nr2 第二个对象age改为2 :', nr2);
// const nr3 = update(getFuzaArr(), '@child{$parent}.sub', { name: 'hi' }).when({ $parent: { text: 'arr3' } }).val();
// output('nr3 text为arr3的对象下sub.name改为hi :', nr3);
// const nr4 = update(getFuzaArr(), '@child{$parent}.sub.subArr.@child{$sub}', { status: 'done' }).when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } }).val();
// output('nr4 text为arr2的对象下sub.subArr中subText=sub1对象的status为done :', nr4);
// const nr4_2 = update(getFuzaArr(), '@child{$parent}.sub.subArr.@child{$sub}')
//             .when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } })
//             .to((parent, subs) => {
//               subs.forEach((sub) => {
//                 sub.status = 'done';
//               });
//             }).val();
// output('nr4_2 text为arr2的对象下sub.subArr中subText=sub1对象的status为done :', nr4_2);
// const nr5 = update(getFuzaArr(), '@child{$parent}.sub')
//             .when({ $parent: { age: 3 } })
//             .to((parent, subs) => {
//               // parent.forEach((p) => {
//                 // if (p.age === 3) { 不要在to里做判断筛选，应该放到when中
//                 // }
//               // });
//               subs.forEach((sub) => {
//                 sub.extra = false;
//                 sub.subArr.length = 1;
//               });
//             }).val();
// output('nr5 age为3的对象下sub.extra改为false，subArr长度改为1 :', nr5);
// const nr6 = update(getFuzaArr(), '@child.arr.@child')
//             .to((arrs) => {
//               arrs.forEach((arr) => {
//                 if (arr.includes(5)) {
//                   _.pull(arr, 6);
//                 }
//               });
//             })
//             .val();
// output('nr6 所有arr中包含5的数组移除6 :', nr6);
// const nr7 = update(getFuzaArr(), '@child{$parent}.arr.@child')
//             .when({ $parent: 'hide' })
//             .to((parent, arrs) => {
//               arrs.forEach((arr) => {
//                 if (arr.includes(5)) {
//                   _.pull(arr, 6);
//                 }
//               });
//             })
//             .val();
// output('nr7 有hide属性的arr中包含5的数组移除6 :', nr7);

// const rs1 = update(c(obj), 'params.id', '改动值').val();
// output('rs1 params.id :', rs1);
// const rs2 = update(c(statusMap), '@child', { status: 'DELETED', animation: '改动值' }).val();
// output('rs2 所有child :', rs2);
// const rs3 = update(c(runtimes), '@child{parent}.runtimeList.@child', { status: 'ENABLE**改动值' }).when({ id: 12, parent: { id: 666 } }).val();
// output('rs3 parent id=666的 子id=12的 :', rs3);
// const rs4 = update(c(runtimes), '@child{$parent}.runtimeList.@child')
//             .when({ id: 12, $parent: { id: 555 } })
//             .to((parent, target) => {
//               // parent.push({ time: 123456 });
//               // target[0].end = true;
//               parent.forEach((p) => {
//                 if (p.id === 555) {
//                   target[0].here = true;
//                 }
//               });
//             }).val();
// output('rs4 parent id=555 第一个子级增加here=true :', rs4);
// const rs5 = update(c(statusMap), '@child{$type}.@child', { status: 'DELETED', animation: '改动值' })
//             .when({ status: 'TASK_RUNNING', $type: { '@key': 'zookeeper' } })
//             .val();
// output('rs5 key=zookeeper的 :', rs5);

// const rs6 = remove(obj, 'params', ['id', 'age']).val();
// output('rs6 ************* :', rs6);
// const rs7 = remove(statusMap, '@child', { extra: true }).val();
// output('rs7 ************* :', rs7);
// const rs8 = remove(runtimes, '@child', ['runtimeList']).val();
// output('rs8 ************* :', rs8);
// const rs9 = remove(runtimes, '@child.runtimeList.@child', { name: 'wtf' }).val();
// output('rs9 ************* :', rs9);
