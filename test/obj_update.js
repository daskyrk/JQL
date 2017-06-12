import test from 'ava';
import _ from 'lodash';
import { testObj as testData, clone, update as fn } from '../src/base_for_test';

const getData = clone(testData);
const origin = null;
let result = null;


test('arr下第一个对象加了add属性', (t) => {
  result = fn(getData(), 'arr.0', { add: 'hello' }).val();
  t.is(result.arr[0].add, 'hello');
  t.snapshot(result);
});

test('arr下第一个sub name改为hello', (t) => {
  result = fn(getData(), 'arr.0.sub', { name: 'hello' }).val();
  t.is(result.arr[0].sub.name, 'hello');
  t.snapshot(result);
});

test('arr下所有的sub name都改为hello', (t) => {
  result = fn(getData(), 'arr.@child.sub', { name: 'hello' }).val();
  result.arr.forEach(({ sub }) => {
    t.is(sub.name, 'hello');
  });
  t.snapshot(result);
});

test('arr下extra=true的sub name都改为hello', (t) => {
  result = fn(getData(), 'arr.@child.sub', { name: 'hello' }).when({ extra: true }).val();
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
  result = fn(getData(), 'arr.0', 'hello').val();
  t.is(result.arr[0], 'hello');
  t.snapshot(result);
});

test('arr下text=arr2的对象age都改为hello', (t) => {
  result = fn(getData(), 'arr.@child', { age: 'hello' }).when({ text: 'arr2' }).val();
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
  result = fn(getData(), 'obj.obj_arr', 'hello').val();
  t.is(result.obj.obj_arr, 'hello');
  t.snapshot(result);
});

test('obj下新增test属性为 hello', (t) => {
  result = fn(getData(), 'obj.test', 'hello').val();
  t.is(result.obj.test, 'hello');
  t.snapshot(result);
});

test('obj下新增test.hh属性为 hello 会报错', (t) => {
  const error = t.throws(() => {
    result = fn(getData(), 'obj.test.hh', 'hello').val();
  }, TypeError);
  t.is(error.message, 'Cannot set property \'hh\' of undefined');
});

test('根级属性base改为 hello', (t) => {
  result = fn(getData(), 'base', 'hello').val();
  t.is(result.base, 'hello');
  t.snapshot(result);
});

