import test from 'ava';
import _ from 'lodash';
import { testObj as testData, clone, remove as fn } from '../src/base_for_test';

const getData = clone(testData);
const origin = null;
let result = null;


test('移除根级属性base', (t) => {
  result = fn(getData(), '', ['base']).val();
  t.is(result.base, undefined);
  t.snapshot(result);
});

test('移除obj.love obj.like两个属性', (t) => {
  result = fn(getData(), 'obj', ['love', 'like']).val();
  t.is(result.obj.love, undefined);
  t.is(result.obj.like, undefined);
  t.snapshot(result);
});

test('移除obj.obj_arr里的第4项 ’乱入‘', (t) => {
  result = fn(getData(), 'obj.obj_arr.3').val();
  t.is(result.obj.obj_arr.length, 3);
  t.falsy(result.obj.obj_arr.includes('乱入'));
  t.snapshot(result);
});

// todo 添加toFn ？
// test('移除obj.obj_arr里的 ’乱入‘', (t) => {
//   result = fn(getData(), 'obj.obj_arr', '乱入').val();
//   t.is(result.obj.obj_arr.length, 3);
//   t.falsy(result.obj.obj_arr.includes('乱入'));
//   t.snapshot(result);
// });

test('移除obj.obj_arr里isYou为true的', (t) => {
  result = fn(getData(), 'obj.obj_arr', { isYou: true }).val();
  t.falsy(_.find(result.obj.obj_arr, { isYou: true }));
  t.snapshot(result);
});

test('移除obj.obj_arr里无匹配的', (t) => {
  result = fn(getData(), 'obj.obj_arr', { isYou: true, notExist: true }).val();
  const length = result.obj.obj_arr.length;
  t.is(length, 4);
  t.is(result.obj.obj_arr[length - 1], '乱入');
  t.snapshot(result);
});

