import _ from 'lodash';
// import chain from './core';
import { testArr, testObj, clone, update, remove } from './base_for_test';

const div = document.querySelector('#output');
const output = (...args) => {
  console.log(...args);
  let str = div.innerHTML;
  args.forEach((arg) => {
    if (typeof arg === 'string') {
      str += `<h3>${arg}</h3>`;
    } else {
      str += JSON.stringify(arg);
    }
    str += '<br/>';
  });
  div.innerHTML = str;
};

// const getObj = clone(testObj);
const getArr = clone(testArr);

export default (() => {
  let result = null;

  // todo: 分离when的参数和toFnArgArr的依赖，不使用when时也有toFnArgArr  .when({extra: true})
  result = remove(getArr(), '@child{$p}.sub').to((ps, targets) => {
    ps.forEach((p) => {
      if (p.extra === false) {
        _.pull(ps, p);
      }
    });
  }).val();
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
})();
