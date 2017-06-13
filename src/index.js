import _ from 'lodash';
import chain from './core';
import { testArr, testObj , clone, update, remove } from './base_for_test';

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

const getObj = clone(testObj);
const getArr = clone(testArr);

export default (() => {
  let result = null;

  // todo: 分离when的参数和toFnArgArr的依赖，不使用when时也有toFnArgArr
  // result = remove(getArr(), '@child{$p}.sub').when({extra: true}).to((ps, targets)=>{
  //   debugger
  //   ps.forEach(p=>{
  //     if (p.extra === false) {
  //       _.pull(ps, p);
  //     };
  //   })
  // }).val();
  // result = remove(getArr(), '@child{$p}.sub').when((ps, childs)=>{
  //   // console.log("ps, childs:",ps, childs);
  //   // return childs.map(child=>{
  //   //   return child.hide !== undefined;
  //   // })
  // debugger;
  // let tr  = _.filter(childs, (child=>{return child.extra}));
  // console.log("after:",tr);
  //   return {
  //     targets: tr
  //   }
  // }).val();
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
