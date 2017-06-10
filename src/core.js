import _ from 'lodash';

const logFn = tip => console.log.apply(console, [`%c ${tip}`, 'color: red']);
const warn = console.warn || logFn;

const chain = {
  update(source, str, value) {
    this.initArgs({ source, str, value });
    this.updateMode = true;
    return this;
  },
  remove(source, str, removeFilter) {
    // this.removeMode = true;
    this.initArgs({ source, str, removeFilter });
    return this;
  },
  initArgs({ source, str, value, removeFilter }) {
    if (Array.isArray(source)) {
      this.sourceType = 'array';
      this.source = [...source];
      this.result = [...source];
    } else {
      this.sourceType = 'object';
      this.source = { ...source };
      this.result = { ...source };
    }
    this.str = str;
    this.value = value;
    this.removeFilter = removeFilter;
    this.tip = setTimeout(() => warn('是否忘了调用val？'), 0);
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
    if (typeof source !== 'object' || source === null) {
      goOn = false;
    }

    if (typeof str === 'string') {
      const deepArray = str === '' ? [] : str.split('.');
      this.deepArray = deepArray;
      // this.lastDeep = deepArray[deepArray.length - 1];
      // this.targetIsObj = !this.lastDeep.startsWith('@');
    } else {
      goOn = false;
      warn('第二个参数应为字符串');
    }

    if (this.updateMode) {
      // toFn和value参数二选一
      if (this.toFn) {
        if (value) {
          goOn = false;
          warn('使用to方法时update不应传第三个参数');
        }
        // 是否要约定 when 中的父级匹配以$开头？
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
        if (!this.valueIsObj) { // 如果value为对象，说明是合并更新，否则deep数组要去掉最后一个，以获得上一级对象
          this.lastDeep = this.deepArray.splice(-1)[0];
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
        this.lastDeep = this.deepArray.splice(-1)[0];
      }
      // if (!this.deepArray.length && !this.lastDeep) {
      //   warn('remove的后两个参数不能都为空');
      // };
    }

    return goOn;
  },
  // 更新时需要找到外层的对象，再更新其某个属性
  getTargets() {
    const deepArray = this.deepArray;
    let targetArr = [];
    let nextResult = [this.result];
    deepArray.forEach((deep) => {
      let temp = [];
      if (deep.startsWith('@child')) {
        nextResult = this.doFilterForWhen(deep, nextResult);
        _.forEach(nextResult, (value, key) => {
          if (Array.isArray(value)) {
            temp = temp.concat(value);
          } else {
            temp.push(value);
          }
        });
      } else if (Array.isArray(nextResult)) {
        temp = nextResult.map(result => this.getDeep(result, deep));
      } else {
        temp.push(this.getDeep(nextResult, deep));
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
  doFilterForWhen(deep, nextResult) {
    const filterObj = this.filterObj;
    let finResult = nextResult;
    nextResult.forEach((result) => {
      let match = deep.match(/\{(.+)\}/);
      match = match ? match[1] : false;
      if (match) {
        const filter = typeof filterObj === 'string' ? filterObj : filterObj[match];
        // 过滤的是对象
        if (filter['@key']) {
          finResult = [result[filter['@key']]];
        } else {
          finResult = _.filter(result, filter);
        }
        console.log('过滤条件:', filter, '过滤后：', finResult);
        delete filterObj[match];
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
    const deepArray = this.deepArray;
    let targetArr = [];
    let nextResult = [this.result];
    deepArray.forEach((deep) => {
      let temp = [];
      if (deep.startsWith('@child')) {
        // @todo 第一个参数为数组时会有问题
        temp = [...nextResult];
      } else {
        temp = nextResult.map(result => this.getDeep(result, deep));
      }
      nextResult = temp;
    });
    targetArr = nextResult;
    return targetArr;
  },
  doRemove(targets, removeFilter) {
    if (removeFilter) {
      const removeAttr = Array.isArray(removeFilter);
      targets.forEach((target) => {
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
