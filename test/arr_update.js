import test from 'ava';
import _ from 'lodash';
import { testArr as testData, clone, update as fn } from '../src/base_for_test';

const getData = clone(testData);
let origin = null;
let result = null;


test('arr中第二个对象age改为222', (t) => {
  result = fn(getData(), '1', { age: 222 }).val();
  t.snapshot(result);
  t.is(result[1].age, 222);
});

test('arr中text为arr3的对象下的sub.name改为hi', (t) => {
  result = fn(getData(), '*{$parent}.sub', { name: 'hi' })
          .when({ $parent: { text: 'arr3' } })
          .val();
  _.filter(result, { text: 'arr3' }).forEach((item) => {
    t.is(item.sub.name, 'hi');
  });
  t.snapshot(result);
});

test('arr中text为arr2的对象下sub.subArr中subText=sub1对象的status改为done', (t) => {
  result = fn(getData(), '*{$parent}.sub.subArr.*{$sub}', { status: 'done' })
          .when({ $parent: { text: 'arr2' }, $sub: { subText: 'sub1' } })
          .val();
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
  result = fn(getData(), '*{$parent}.sub.subArr.*{$sub}')
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
  origin = getData();
  const parentsBefore = _.filter(origin, { age: 3 });
  t.is(parentsBefore.length, 1);
  parentsBefore.forEach((p) => {
    t.true(p.sub.extra);
    t.is(p.sub.subArr.length, 3);
  });
  result = fn(origin, '*{$parent}.sub')
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
  origin = getData();
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
  result = fn(origin, '*.arr.*')
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
  origin = getData();
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
  result = fn(origin, '*{$parent}.arr.*')
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
