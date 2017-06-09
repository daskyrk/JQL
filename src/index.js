import _ from 'lodash';
import chain from './core';

const div = document.querySelector('#output');
const output = (...args) => {
  console.log(...args);
  let str = div.innerHTML;
  args.forEach(arg => {
    if (typeof arg === 'string') {
      str += `<h3>${arg}</h3>`;
    } else {
      str += JSON.stringify(arg);
    }
    str += '<br/>';
  });
  div.innerHTML = str;
};

function update(...args) {
  const chainCopy = { ...chain };
  return chainCopy.update(...args);
}
function remove(...args) {
  const chainCopy = { ...chain };
  return chainCopy.remove(...args);
}

export default (() => {
  const obj = {
    params: {
      id: 1,
      name: 'hhh',
      age: 12
    },
    args: {
      proId: 22,
      region: 'a-b-c',
      arr: [2, 3]
    }
  };
  const runtimes = [
    {
      id: 555,
      runtimeList: [
        { id: 12, name: 'wtf' },
        { id: 13, name: 'qwe' },
        { id: 14, name: 'asd' }
      ]
    },
    {
      id: 666,
      runtimeList: [
        { id: 22, name: 'wtf2' },
        { id: 23, name: 'qwe2' },
        { id: 24, name: 'asd2' }
      ]
    }
  ];
  const statusMap = {
    zookeeper: [
      {
        id:
          'open-source_pampas-blog_test_develop_zookeeper.eb0c4462-4a78-11e7-99ca-70b3d5800001',
        status: 'TASK_RUNNING'
      }
    ],
    mysql: [
      {
        id:
          'open-source_pampas-blog_test_develop_mysql.eb0c6b74-4a78-11e7-99ca-70b3d5800001',
        status: 'TASK_RUNNING'
      }
    ],
    'blog-web': [
      {
        id:
          'open-source_pampas-blog_test_develop_blog-web.1beec367-4a79-11e7-99ca-70b3d5800001',
        status: 'TASK_RUNNING',
        extra: true
      }
    ],
    'blog-service': [
      {
        id:
          'open-source_pampas-blog_test_develop_blog-service.11f22734-4a79-11e7-99ca-70b3d5800001',
        status: 'TASK_RUNNING'
      }
    ],
    'user-service': [
      {
        id:
          'open-source_pampas-blog_test_develop_user-service.08f87c10-4a79-11e7-99ca-70b3d5800001',
        status: 'TASK_STAGING'
      }
    ],
    'showcase-front': [
      {
        id:
          'open-source_pampas-blog_test_develop_showcase-front.29e6a91d-4a79-11e7-99ca-70b3d5800001',
        status: 'TASK_RUNNING'
      }
    ]
  };
  const fuzaObj = {
    arr: [
      {
        text: 'arr1',
        age: 1,
        sub: {
          name: 'obj1Name',
          extra: false
        }
      },
      {
        text: 'arr2',
        age: 1,
        sub: {
          name: 'obj2Name',
          extra: true
        }
      }
    ],
    obj: {
      obj_arr: [
        { obj_arr1: 'hhh' },
        { obj_arr2: 'ggg' },
        { obj_arr3: 'fff', isYou: true },
        '乱入'
      ],
      love: 'you',
      like: 'me'
    },
    base: 'outerBase'
  };
  const fuzaArr = [
    {
      text: 'arr1',
      age: 1,
      sub: {
        name: 'obj1Name',
        extra: false,
        subArr: [
          { subText: 'sub1', status: 'run' },
          { subText: 'sub2', status: 'run' },
          { subText: 'sub3', status: 'run' }
        ]
      },
      arr: [[1, 2, 3], [4, 5, 6]]
    },
    {
      text: 'arr2',
      age: 1,
      sub: {
        name: 'obj2Name',
        extra: true,
        subArr: [
          { subText: 'sub1', status: 'run' },
          { subText: 'sub2', status: 'run' },
          { subText: 'sub3', status: 'run' }
        ]
      },
      arr: [[1, 2, 3], [4, 5, 6]]
    },
    {
      text: 'arr3',
      age: 3,
      sub: {
        name: 'obj3Name',
        extra: true,
        subArr: [
          { subText: 'sub1', status: 'run' },
          { subText: 'sub2', status: 'run' },
          { subText: 'sub3', status: 'run' }
        ]
      },
      hide: '2333',
      arr: [[1, 2, 3], [4, 5, 6]]
    }
  ];

  function getFuzaObj() {
    return _.cloneDeep(fuzaObj);
  }

  function getFuzaArr() {
    return _.cloneDeep(fuzaArr);
  }

  const c = _.cloneDeep;

  // update
  const ns1 = update(getFuzaObj(), 'arr.0', { add: '改动值' }).val();
  output('ns1 arr下第一个对象加了add属性 :', ns1);
  const ns2 = update(getFuzaObj(), 'arr.0.sub', { name: 'wtf改动值' }).val();
  output('ns2 arr下第一个sub name改了 :', ns2);
  const ns3 = update(getFuzaObj(), 'arr.@child.sub', { name: 'wtf改动值' }).val();
  output('ns3 arr下所有的sub name都改了 :', ns3);
  const ns4 = update(getFuzaObj(), 'arr.0', 'woc').val();
  output('ns4 arr下第一个对象改为 woc :', ns4);
  const ns5 = update(getFuzaObj(), 'obj.obj_arr', 'woc').val();
  output('ns5 obj下的obj_arr改为 woc :', ns5);
  const ns6 = update(getFuzaObj(), 'obj.test', 'woc').val();
  output('ns6 obj下新增test属性为 woc :', ns6);
  // const ns7 = update(getFuzaObj(), 'obj.test.hh', 'woc').val();
  // output('ns7 obj下新增test.hh属性为 woc 会报错 :', ns7);
  const ns8 = update(getFuzaObj(), 'base', 'hello').val();
  output('ns8 根级属性base改为hello :', ns8);
  // remove
  const ns9 = remove(getFuzaObj(), '', ['base']).val();
  output('ns9 移除根级属性base :', ns9);
  const ns10 = remove(getFuzaObj(), 'obj', ['love', 'like']).val();
  output('ns10 移除obj.lovelike :', ns10);
  const ns11 = remove(getFuzaObj(), 'obj.obj_arr.3').val();
  output('ns11 移除obj.obj_arr里的 ’乱入‘ :', ns11);
  const ns12 = remove(getFuzaObj(), 'obj.obj_arr', { isYou: true }).val();
  output('ns12 移除obj.obj_arr里isYou为true的 :', ns12);
  const ns13 = remove(getFuzaObj(), 'obj.obj_arr', {
    isYou: true,
    none: false
  }).val();
  output('ns13 移除obj.obj_arr里无匹配的 :', ns13);
  // todo: add @key

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
})();
