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

function getFuzaObj() {
  return _.cloneDeep(fuzaObj);
}

const c = _.cloneDeep;
let origin = null;
let result = null;

/** ******************************* object *********************************/
// update
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

test('arr下extra=true的sub name都改为hello', (t) => {
  result = update(getFuzaObj(), 'arr.@child.sub', { name: 'hello' }).when({ extra: true }).val();
  result.arr.forEach(({ sub }) => {
    if (sub.extra) {
      t.is(sub.name, 'hello');
    } else {
      t.not(sub.name, 'hello');
    }
  });
  t.snapshot(result);
});

test('arr下第一个对象改为 hello', (t) => {
  result = update(getFuzaObj(), 'arr.0', 'hello').val();
  t.is(result.arr[0], 'hello');
  t.snapshot(result);
});

test('arr下text=arr2的对象age都改为hello', (t) => {
  result = update(getFuzaObj(), 'arr.@child', { age: 'hello' }).when({ text: 'arr2' }).val();
  result.arr.forEach((item) => {
    if (item.text === 'arr2') {
      t.is(item.age, 'hello');
    } else {
      t.is(item.age, 1);
    }
  });
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

// todo 添加toFn ？
// test('移除obj.obj_arr里的 ’乱入‘', (t) => {
//   result = remove(getFuzaObj(), 'obj.obj_arr', '乱入').val();
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

/** ******************************* array *********************************/

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
          status: 'run',
        },
      ],
    },
    hide: '2333',
    arr: [[1, 2, 3], [4, 5, 6]],
  },
];

function getFuzaArr() {
  return _.cloneDeep(fuzaArr);
}
// update
test('arr中第二个对象age改为222', (t) => {
  result = update(getFuzaArr(), '1', { age: 222 }).val();
  t.snapshot(result);
  t.is(result[1].age, 222);
});

test('arr中text为arr3的对象下的sub.name改为hi', (t) => {
  result = update(getFuzaArr(), '@child{$parent}.sub', { name: 'hi' }).when({ $parent: { text: 'arr3' } }).val();
  _.filter(result, { text: 'arr3' }).forEach((item) => {
    t.is(item.sub.name, 'hi');
  });
  t.snapshot(result);
});

test('arr中text为arr2的对象下sub.subArr中subText=sub1对象的status改为done', (t) => {
  result = update(getFuzaArr(), '@child{$parent}.sub.subArr.@child{$sub}', { status: 'done' }).when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } }).val();
  const parents = _.filter(result, { text: 'arr2' });
  t.is(parents.length, 1);
  const targets = parents.reduce((prev, curr) => {
    return prev.concat(_.filter(curr.sub.subArr, { subText: 'sub1' }));
  }, []);
  t.is(targets.length, 1);
  t.is(targets[0].status, 'done');
  t.snapshot(result);
});

test('arr中text为arr2的对象下sub.subArr中subText=sub1对象的status改为failed 使用to方法', (t) => {
  result = update(getFuzaArr(), '@child{$parent}.sub.subArr.@child{$sub}')
          .when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } })
          .to((parents, subs) => {
            subs.forEach((sub) => {
              sub.status = 'failed';
            });
          }).val();
  const parents = _.filter(result, { text: 'arr2' });
  t.is(parents.length, 1);
  const targets = parents.reduce((prev, curr) => {
    return prev.concat(_.filter(curr.sub.subArr, { subText: 'sub1' }));
  }, []);
  t.is(targets.length, 1);
  t.is(targets[0].status, 'failed');
  t.snapshot(result);
});

test('arr中age为3的对象下的sub.extra改为false，subArr长度改为1', (t) => {
  origin = getFuzaArr();
  const parentsBefore = _.filter(origin, { age: 3 });
  t.is(parentsBefore.length, 1);
  parentsBefore.forEach((p) => {
    t.true(p.sub.extra);
    t.is(p.sub.subArr.length, 3);
  });
  result = update(origin, '@child{$parent}.sub')
          .when({ $parent: { age: 3 } })
          .to((parents, subs) => {
            subs.forEach((sub) => {
              sub.extra = false;
              sub.subArr.length = 1;
            });
          }).val();
  const parentsAfter = _.filter(result, { age: 3 });
  t.is(parentsAfter.length, 1);
  parentsAfter.forEach((p) => {
    t.false(p.sub.extra);
    t.is(p.sub.subArr.length, 1);
  });
  t.snapshot(result);
});

test('所有arr中包含5的数组移除6', (t) => {
  origin = getFuzaArr();
  const targetsBefore = [];
  _.forEach(origin, (item) => {
    item.arr.forEach((subArr) => {
      subArr.includes(5) && targetsBefore.push(subArr);
    });
  });
  t.is(targetsBefore.length, 3);
  targetsBefore.forEach((arr) => {
    t.truthy(arr.includes(6));
    t.is(arr.toString(), '4,5,6');
  });
  result = update(origin, '@child.arr.@child')
          .to((arrs) => {
            arrs.forEach((arr) => {
              if (arr.includes(5)) {
                _.pull(arr, 6);
              }
            });
          }).val();
  const targetsAfter = [];
  _.forEach(result, (item) => {
    item.arr.forEach((subArr) => {
      subArr.includes(5) && targetsAfter.push(subArr);
    });
  });
  t.is(targetsAfter.length, 3);
  targetsAfter.forEach((arr) => {
    t.falsy(arr.includes(6));
    t.is(arr.toString(), '4,5');
  });
  t.snapshot(result);
});

test('有hide属性的arr中包含5的数组移除6', (t) => {
  origin = getFuzaArr();
  const targetsBefore = [];
  let notChange = null;
  _.forEach(origin, (item) => {
    if (item.hide !== undefined) {
      item.arr.forEach((subArr) => {
        subArr.includes(5) && targetsBefore.push(subArr);
      });
    } else {
      notChange = item;
    }
  });
  t.is(targetsBefore.length, 1);
  targetsBefore.forEach((arr) => {
    t.truthy(arr.includes(6));
    t.is(arr.toString(), '4,5,6');
  });
  t.is(notChange.arr[1].toString(), '4,5,6');
  result = update(origin, '@child{$parent}.arr.@child')
          .when({ $parent: 'hide' })
          .to((parent, arrs) => {
            arrs.forEach((arr) => {
              if (arr.includes(5)) {
                _.pull(arr, 6);
              }
            });
          }).val();
  const targetsAfter = [];
  _.forEach(result, (item) => {
    if (item.hide !== undefined) {
      item.arr.forEach((subArr) => {
        subArr.includes(5) && targetsAfter.push(subArr);
      });
    } else {
      notChange = item;
    }
  });
  t.is(targetsAfter.length, 1);
  targetsAfter.forEach((arr) => {
    t.falsy(arr.includes(6));
    t.is(arr.toString(), '4,5');
  });
  t.is(notChange.arr[1].toString(), '4,5,6');
  t.snapshot(result);
});

// remove
test('移除arr中index为1的项', (t) => {
  origin = getFuzaArr();
  t.is(origin.length, 3);
  result = remove(origin, '1').val();
  t.is(result.length, 2);
  t.is(result[1].text, 'arr3');
  t.snapshot(result);
});

test('移除arr中hide属性为2333的项', (t) => {
  origin = getFuzaArr();
  t.is(origin.length, 3);
  result = remove(origin, '@child', { hide: '2333' }).val();
  t.is(result.length, 2);
  t.snapshot(result);
});

// @todo 移除arr中的某个对象还是对象中的某个属性？
test('移除arr有hide属性的项', (t) => {
  origin = getFuzaArr();
  t.is(origin.length, 3);
  result = remove(origin, '', {'@key': 'hide'}).val();
  // t.is(result.length, 2);
  t.snapshot(result);
});

// 移除父级还是子级？判断依据？
// test('移除arr中sub.extra为false的项', (t) => {
//   origin = getFuzaArr();
//   t.is(origin.length, 3);
//   result = remove(origin, '@child.sub', { extra: false }).val();
//   console.log('result:', result);
//   t.is(result.length, 2);
//   t.snapshot(result);
// });
