import _ from 'lodash';

const CHILD = '@child';
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
    // this.removeMode = true;
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
    this.value = value;
    this.removeFilter = removeFilter;
    this.tip = setTimeout(() => warn('是否忘了调用val？'), 0);
  },
  checkInitArgs({ source, str }) {
    let goOn = true;
    if (typeof source !== 'object' || source === null) {
      goOn = false;
      warn('第一个参数应为对象或数组');
    }

    if (typeof str === 'string') {
      const pathArray = str === '' ? [] : str.split('.');
      this.pathArray = pathArray;
    } else {
      goOn = false;
      warn('第二个参数应为字符串');
    }
  },
  when(filter) {
    const type = typeof filter;
    switch (type) {
      case 'object':
        this.filterObj = filter;
        break;
      case 'string':
        this.filterObj = filter;
        break;
      case 'function':
        this.filterFn = filter;
        this.filterFnArgArr = [];
        const pathFilterArr = []
        this.pathArray.forEach((path) => {
          const match = path.match(/\{(.+)\}/);
          match && pathFilterArr.push(match[1]);
        });
        if (filter.length !== pathFilterArr.length+1) {
          warn('when的参数和路径中的数量不匹配');
        }
        this.pathFilterArr = pathFilterArr;
        break;
      default:
        warn('条件应为对象、字符串或方法');
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
    const goOn = this.checkArgs(this.source, this.str, this.value);
    if (!goOn) {
      warn('参数不正确，返回');
      this.stop();
      return this;
    }
    if (this.updateMode) {
      this.doUpdate(this.getTargets(), this.value);
    } else {
      this.doRemove(this.getRemoveTargets(), this.removeFilter);
    }
    return this.result;
  },
  checkArgs(source, str, value) {
    let goOn = true;
    if (this.updateMode) {
      // toFn和value参数二选一
      if (this.toFn) {
        if (value !== undefined) {
          goOn = false;
          warn('使用to方法时update不应传第三个参数');
        }
        // 约定 when 中的父级匹配以$开头 有可能参数包括最后一个，比如a{$p}.b{$c}, when(p, c)，这时需要判断最后一个是否$开头，有则长度一致
        // const filterLength = _.filter(_.keys(this.filterObj), key => key.startsWith('$')).length;
        // if (filterLength !== this.toFnArgLength - 1) {
        //   goOn = false;
        //   warn('when和to的参数个数不匹配');
        // }
      } else {
        if (value === undefined) {
          goOn = false;
          warn('update缺少第三个参数');
        }
        this.valueIsObj = typeof value === 'object';
        if (!this.valueIsObj) { // 如果value为对象，说明是合并更新，否则path数组要去掉最后一个，以获得上一级对象
          this.lastDeep = this.pathArray.splice(-1)[0];
        }
        // if (this.targetIsObj && this.valueIsObj) {
        //   goOn = false;
        //   warn('update第三个参数应为对象');
        // }
        // if (!this.targetIsObj && !this.valueIsObj) {
        //   goOn = false;
        //   warn('应该使用replace代替update');
        // }
      }
    } else {
      if (this.removeFilter === undefined) {
        this.lastDeep = this.pathArray.splice(-1)[0];
      }
      // if (!this.pathArray.length && !this.lastDeep) {
      //   warn('remove的后两个参数不能都为空');
      // };
    }

    return goOn;
  },
  // 更新时需要找到外层的对象，再更新其某个属性
  getTargets() {
    const pathArray = this.pathArray;
    let targetArr = [];
    let nextResult = [this.result];
    pathArray.forEach((path) => {
      let temp = [];
      if (path.startsWith(CHILD)) {
        nextResult = this.doFilterForWhen(path, nextResult);
        _.forEach(nextResult, (value, key) => {
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
    });
    targetArr = nextResult;
    return targetArr;
  },
  getDeep(target, attr) {
    if (target[attr] !== undefined) {
      return target[attr];
    }
    warn(`对象${JSON.stringify(target)}的${attr}属性不存在`);
    this.stop();
  },
  stop() {
    this.val = () => null;
  },
  doFilterForWhen(path, nextResult) {
    const filterObj = this.filterObj;
    let finResult = nextResult;
    nextResult.forEach((result) => {
      let match = path.match(/\{(.+)\}/);
      match = match ? match[1] : false;
      if (match) {
        if (filterObj) {
          const filter = typeof filterObj === 'string' ? filterObj : filterObj[match];
          // 过滤的是对象
          if (filter[KEY]) {
            finResult = [result[filter[KEY]]];
          } else {
            finResult = _.filter(result, filter);
          }
          console.log('过滤条件:', filter, '过滤后：', finResult);
          delete filterObj[match];
        } else if (filterFn) {
          // 应该只能在最后进行一次性过滤
          this.filterFnArgArr.push(finResult);
        }
        if (this.toFn) {
          this.toFnArgArr.push(finResult);
        }
      }
    });
    return finResult;
  },
  doUpdate(targets, value) {
    if (this.filterObj) {
      targets = _.filter(targets, this.filterObj);
    }
    console.log('目标是:', targets);
    if (this.filterFn) {
      this.filterFnArgArr.push(targets);
      this.filterFn.apply(this, this.filterFnArgArr);
    }
    if (this.toFn) {
      this.toFnArgArr.push(targets);
      this.toFn.apply(this, this.toFnArgArr);
    }

    targets.forEach((item) => {
      if (this.valueIsObj) {
        Object.assign(item, value);
      } else if (!this.toFn) { // 没有toFn时才直接赋值，否则会把@child属性放上去
        item[this.lastDeep] = value;
      }
    });
  },
  getRemoveTargets() {
    const pathArray = this.pathArray;
    let targetArr = [];
    let nextResult = [this.result];
    pathArray.forEach((path) => {
      let temp = [];
      if (path.startsWith(CHILD)) {
        // @todo 第一个参数为数组时会有问题
        nextResult = this.doFilterForWhen(path, nextResult);
        temp = [...nextResult];
      } else {
        temp = nextResult.map(result => this.getDeep(result, path));
      }
      nextResult = temp;
    });
    targetArr = nextResult;
    return targetArr;
  },
  doRemove(targets, removeFilter) {
    if (this.filterFn) {
      this.filterFnArgArr.push(targets);
      this.filterFn.apply(this, this.filterFnArgArr);
    }
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
      targets.forEach(target => _.pullAt(target, this.lastDeep));
    }
  },
};

export default chain;
