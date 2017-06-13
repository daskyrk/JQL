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
  result = fn(origin, '', { hide: '2333' }).val();
  t.is(result.length, 2);
  t.snapshot(result);
});

test('移除arr下所有对象的hide', (t) => {
  origin = getData();
  t.is(origin[2].hide, '2333');
  result = fn(origin, '@child', ['hide']).val();
  t.is(result[2].hide, undefined);
  t.snapshot(result);
});

test('移除arr下age=3对象的hide', (t) => {
  origin = getData();
  t.is(origin[2].hide, '2333');
  result = fn(origin, '@child', ['hide']).when({ age: 3 }).val();
  t.is(result[2].hide, undefined);
  t.snapshot(result);
});

test('移除arr下age=2对象的hide(无匹配)', (t) => {
  origin = getData();
  t.is(origin[2].hide, '2333');
  result = fn(origin, '@child', ['hide']).when({ age: 2 }).val();
  t.is(result[2].hide, '2333');
  t.snapshot(result);
});

test('移除arr.sub.subArr下所有对象的status属性', (t) => {
  origin = getData();
  origin.forEach(item=>{
    item.sub.subArr.forEach(subObj=>{
      t.not(subObj.status, undefined);
    })
  })
  result = fn(origin, '@child.sub.subArr.@child', ['status']).val();
  result.forEach(item=>{
    item.sub.subArr.forEach(subObj=>{
      t.is(subObj.status, undefined);
    })
  })
  t.snapshot(result);
});

// 移除父级还是子级？判断依据？ 如果要根据子级条件移除父级，应该用when或to方法
// test('移除arr中sub.extra为false的项', (t) => {
//   origin = getData();
//   t.is(origin.length, 3);
//   result = fn(origin, '@child{$p}.sub', { extra: false }).to((ps, targets)=>{
//     ps.forEach(p=>{
//       if (p.sub.extra === false) {
//         _.pull(ps, p);
//       };
//     })
//   }).val();
//   console.log('result:', result);
//   t.is(result.length, 2);
//   t.snapshot(result);
// });
