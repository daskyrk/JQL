import _ from 'lodash';
import chain from './core';

export const testObj = {
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

export const testArr = [
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

export const clone = source => () => _.cloneDeep(source);

export function update(...args) {
  const chainCopy = { ...chain };
  return chainCopy.update(...args);
}

export function remove(...args) {
  const chainCopy = { ...chain };
  return chainCopy.remove(...args);
}
