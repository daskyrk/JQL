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

  let result = remove(getFuzaArr(), '@child.sub', { extra: false }).val();
  output('rs1 result :', result);

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
