import test from 'ava';
import _ from 'lodash';
import { testArr as testData, clone, remove as fn } from '../src/base_for_test';

const getData = clone(testData);
let origin = null;
let result = null;


test('移除arr中index为1的项', (t) => {
  origin = getData();
  t.is(origin.length, 3);
  result = fn(origin, '1').val();
  t.is(result.length, 2);
  t.is(result[1].text, 'arr3');
  t.snapshot(result);
});

test('移除arr中hide属性为2333的项', (t) => {
  origin = getData();
  t.is(origin.length, 3);
  result = fn(origin, '@child', { hide: '2333' }).val();
  t.is(result.length, 2);
  t.snapshot(result);
});

// @todo 移除arr中的某个对象还是对象中的某个属性？
// test('移除arr有hide属性的项', (t) => {
//   origin = getData();
//   t.is(origin.length, 3);
//   result = fn(origin, '', {'@key': 'hide'}).val();
//   t.is(result.length, 2);
//   t.snapshot(result);
// });

// 移除父级还是子级？判断依据？
// test('移除arr中sub.extra为false的项', (t) => {
//   origin = getData();
//   t.is(origin.length, 3);
//   result = fn(origin, '@child.sub', { extra: false }).val();
//   console.log('result:', result);
//   t.is(result.length, 2);
//   t.snapshot(result);
// });
