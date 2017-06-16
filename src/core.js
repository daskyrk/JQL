import _ from 'lodash';

const CHILD = '*';
const KEY = '@KEY';

const logFn = tip => console.log.apply(console, [`%c ${tip}`, 'color: red']);
const warn = console.warn || logFn;

// *** update
// 匹配到的类型如果是数组
// [1,2,3,4,5] -> {a:1} 替换
// [1,2,3,4,5] -> @index=1 更新某一个，应该用arr.1或者when进行过滤 这还是需要看具体的源类型
// [1,2,3,4,5] -> [5,6] 如果有|merge则合并，否则替换
// [1,2,3,4,5] -> 1、‘test’、null、undefined 替换

//  {a:1} -> {b:2} 合并
//  {a:1} -> [1,2] 替换
//  {a:1} -> 1、’string‘、null、bool 替换

// 基本类型 -> 所有类型 替换

// *** remove

const chain = {
  update(source, str, value) {
    this.updateMode = true;
    this.initArgs({ source, str, value });
    return this;
  },
  remove(source, str, removeFilter) {
    this.initArgs({ source, str, removeFilter });
    return this;
  },
  initArgs({ source, str, value, removeFilter }) {
    this.checkInitArgs({ source, str });
    if (Array.isArray(source)) {
      this.sourceType = 'array';
      this.source = [...source];
      this.result = [...source];
    } else if (_.isObject(source) && !_.isNull(source)) {
      this.sourceType = 'object';
      this.source = { ...source };
      this.result = { ...source };
    }
    this.str = str;
    this.initPathArray(str);
    this.value = value;
    this.removeFilter = removeFilter;
    this.tip = setTimeout(() => warn('是否忘了调用val？'), 0);
  },
  initPathArray(str) {
    const paths = str === '' ? [] : str.split('.');
    this.pathArray = paths.map((path) => {
      const item = {
        path,
        origin: path,
        wantChildren: path.startsWith(CHILD),
      };
      const match = path.match(/\{(.+)\}/);
      if (match) {
        // remove {$tag}
        item.path = path.slice(0, -match.length - 2);
        item.tag = match[1];
      }
      return item;
    });
  },
  checkInitArgs({ source, str }) {
    if (typeof source !== 'object' || source === null) {
      this.hasError = true;
      warn('第一个参数应为对象或数组');
    }

    if (typeof str !== 'string') {
      this.hasError = true;
      warn('第二个参数应为字符串');
    }
  },
  when(filter) {
    const type = typeof filter;
    switch (type) {
      case 'object':
        this.filterObj = filter;
        break;
      // case 'string':
      //   this.filterObj = filter;
      //   break;
      case 'function':
        this.filterFn = filter;
        this.filterFnArgArr = [];
        break;
      default:
        warn('条件应为对象或方法');
    }
    return this;
  },
  to(fn) {
    this.toFn = fn;
    this.toFnArgLength = fn.length;
    this.toFnArgArr = [];
    return this;
  },
  val() {
    clearTimeout(this.tip);
    this.checkArgs(this.source, this.str, this.value);
    if (this.hasError) {
      warn('参数不正确，返回');
      this.stop();
      return this;
    }
    if (this.updateMode) {
      this.doUpdate(this.getTargets(), this.value);
    } else {
      this.doRemove(this.getTargets(), this.removeFilter);
    }
    return this.result;
  },
  checkArgs(source, str, value) {
    if (this.updateMode) {
      // toFn和value参数二选一
      if (this.toFn) {
        if (value !== undefined) {
          warn('使用to方法时update不应传第三个参数');
          this.hasError = true;
        }
        // 约定 when 中的父级匹配以$开头 有可能参数包括最后一个，比如a{$p}.b{$c}, when(p, c)，这时需要判断最后一个是否$开头，有则长度一致
        // const filterLength = _.filter(_.keys(this.filterObj), key => key.startsWith('$')).length;
        // if (filterLength !== this.toFnArgLength - 1) {
        //   goOn = false;
        //   warn('when和to的参数个数不匹配');
        // }
      } else {
        if (value === undefined) {
          warn('update缺少第三个参数');
          this.hasError = true;
        }
        this.valueIsObj = typeof value === 'object';
        if (!this.valueIsObj) { // 如果value为对象，说明是合并更新，否则path数组要去掉最后一个，以获得上一级对象
          this.lastPath = this.pathArray.splice(-1)[0].path;
        }
      }
    } else if (this.removeFilter === undefined) {
      this.lastPath = this.pathArray.splice(-1)[0].path;
      // if (!this.pathArray.length && !this.lastPath) {
      //   warn('remove的后两个参数不能都为空');
      // };
    }
  },
  stop() {
    this.val = () => null;
  },
  // 更新时需要找到外层的对象，再更新其某个属性
  getTargets() {
    const pathArray = this.pathArray;
    let nextResult = [this.result];
    // 根据每一节路径筛选
    pathArray.forEach((pathObj) => {
      const { wantChildren, path, tag } = pathObj;
      let temp = [];
      if (tag) {
        nextResult = this.filterWithTag(tag, nextResult);
      }
      if (wantChildren) {
        _.forEach(nextResult, (value) => {
          if (Array.isArray(value)) {
            temp = temp.concat(value);
          } else {
            temp.push(value);
          }
        });
      } else if (Array.isArray(nextResult)) {
        temp = nextResult.map(result => this.getDeep(result, path));
      } else {
        temp.push(this.getDeep(nextResult, path));
      }
      nextResult = temp;
      pathObj.result = nextResult;
    });
    return nextResult;
  },
  getDeep(target, attr) {
    if (target[attr] === undefined) {
      warn(`对象${JSON.stringify(target)}的${attr}属性不存在`);
      this.stop();
    }
    return target[attr];
  },
  filterWithObj(filterObj, tag, nextResult) {
    let finResult = nextResult;
    nextResult.forEach((result) => {
      const filter = filterObj[tag];
      // 过滤的是对象
      if (filter[KEY]) {
        // 取得每个对象的某个属性构成的数组
        finResult = [result[filter[KEY]]];
      } else {
        finResult = _.filter(result, filter);
      }
      console.log('过滤条件:', filter, '过滤后：', finResult);
      delete filterObj[tag];
      if (this.toFn) {
        this.toFnArgArr.push(finResult);
      }
    });
    return finResult;
  },
  filterWithTag(tag, nextResult) {
    const filterObj = this.filterObj;
    const filterFn = this.filterFn;
    let result = nextResult;
    if (filterObj) {
      result = this.filterWithObj(filterObj, tag, nextResult);
    } else if (filterFn) {
      // 应该只能在最后进行一次性过滤
      this.filterFnArgArr.push(nextResult);
    }
    return result;
  },
  doUpdate(targets, value) {
    // 用移除了$tag的filter对象对目标集合做最后过滤
    if (this.filterObj) {
      targets = _.filter(targets, this.filterObj);
    }
    console.log('目标是:', targets);
    // if (this.filterFn) {
    //   this.filterFnArgArr.push(targets);
    //   this.filterFn.apply(this, this.filterFnArgArr);
    // }
    this.execToFn(targets);

    targets.forEach((item) => {
      if (this.valueIsObj) {
        Object.assign(item, value);
      } else if (!this.toFn) { // 没有toFn时才直接赋值，否则会把*属性放上去
        item[this.lastPath] = value;
      }
    });
  },
  execToFn(targets) {
    if (this.toFn) {
      this.toFnArgArr.push(targets);
      this.toFn(...this.toFnArgArr);
    }
  },
  doRemove(targets, removeFilter) {
    // 用移除了$tag的filter对象对目标集合做最后过滤
    if (this.filterObj) {
      targets = _.filter(targets, this.filterObj);
    }
    if (this.filterFn) {
      this.filterFnArgArr.push(targets);
      // 每次有一个参数可用：用户需要写if判断，根据父级判断子级时无法实现
      // this.filterFnArgArr.forEach((arg, i)=>{
      //   // let index = Math.max(i-1, 0);
      //   let tempArg = Array(i+1);
      //   tempArg[i] = arg;
      //   debugger;
      //   _.filter(arg, this.filterFn.bind(this, tempArg));
      // })

      // 把所有参数一次传入，返回一个对象，key->要更新的目标：这种需要对应key到path筛选的数组上
      // 但是用when来做移除操作很奇怪，判断和移除可以分离吗？ 复杂操作还是用toFn吧
      // let res = this.filterFn.apply(this, this.filterFnArgArr);
      // let pathFilters = [];
      // _.forEach(this.pathArray, (path)=>path.tag && pathFilters.push(path.tag));
      // _.forEach(res, (value, key)=>{
      //   if (key === 'targets') {
      //     debugger
      //     value.forEach(remove=>{
      //       _.pull(this.filterFnArgArr[this.filterFnArgArr.length-1],remove);
      //     })
      //   };
      //   if (pathFilters.includes[key]) {
      //     console.log("get:");
      //   };
      // })
      // console.log("res:",res);
    }
    this.execToFn(targets);

    if (removeFilter) {
      const removeAttr = Array.isArray(removeFilter);
      targets.forEach((target) => {
        // if (Array.isArray(target)) {
        //   console.log("暂未处理:");
        //   // this.doRemove(target, removeFilter);
        // }else {
        // }
        if (removeAttr) {
          removeFilter.forEach(key => delete target[key]);
        } else {
          _.remove(target, removeFilter);
        }
      });
    } else {
      targets.forEach(target => _.pullAt(target, this.lastPath));
    }
  },
};

export default chain;
