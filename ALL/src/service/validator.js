const validator = {

    cabinsCheck(cabins) {
        let countSet = new Set();
        cabins.forEach(cabin => {
            validator.numberCheck(cabin['count'], 1, 180, true, '舱位数量');
            validator.numberCheck(cabin['tax'], 1, 100000, true, '税');
            validator.numberCheck(cabin['price'], 1, 1000000, true, '舱位价格');
            validator.valueNullCheck(cabin['name'], true, '舱位名称');
            countSet.add(cabin['count']);
        })
        if (countSet.size < cabins.length) {
            throw {'type': 'DataFormat', 'status': 5, 'message': '输入了一样的舱位数量!'};
        }
    },

    singleAirLineCheck(airLine, require) {
        if (!airLine && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': '航线/起降机场数据未输入!'};
        }
        if (!airLine && !require) {
            return;
        }
        let cites = airLine.split('-');
        if (cites.length !== 2 || cites[0].length !== 3 || cites[1].length !== 3) {
            throw {'type': 'DataFormat', 'status': 5, 'message': '航线/起降机场输入格式不正确!'};
        }
        return cites;
    },

    adultTaxCheck(tax, require) {
        return this.numberCheck(tax, 1, 10000, require, '成人税');
    },

    childTaxCheck(tax, require) {
        return this.numberCheck(tax, 1, 10000, require, '儿童税');
    },

    valueNullCheck(value, require, field) {
        if (!value && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '数据未输入!'};
        }
        if (!value && !require) {
            return;
        }
    },

    twoLetterNumberCheck(value, require, field) {
        if (!value && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '数据未输入!'};
        }
        if (!value && !require) {
            return;
        }
        let reg = /^[A-Z0-9]{2}$/;
        if (!reg.test(value)) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '格式不正确，输入由字母（大写）数字组成的两位字符串!'};
        }
    },

    threeLetterCheck(value, require, field) {
        if (!value && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '数据未输入!'};
        }
        if (!value && !require) {
            return;
        }
        let reg = /^[A-Z]{3}$/;
        if (!reg.test(value)) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '格式不正确，输入3位大写字母组成的字符串!'};
        }
    },

    numberFormatCheck(value, require, field) {
        if ((value + '').length == 0 && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '数据未输入!'};
        }
        if (!value && !require) {
            return;
        }
        let reg = /^[0-9\\-]+$/;
        if (!reg.test(value)) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '格式不正确, 请输入相应的数字!'};
        }
    },

    numberCheck(value, min, max, require, field) {
        if (!value && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '数据未输入!'};
        }
        if (!value && !require) {
            return;
        }
        if (!(value >= min && value <= max)) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '值不在允许的范围:' + min + '~' + max};
        }
    },

    startEndTimeCheck(startTime, endTime, require, field) {
        if (!field) {
            field = '';
        }
        console.log('Date [%s] [%s]', startTime, endTime, typeof (startTime), typeof (endTime));
        if ((!startTime || !endTime) && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '开始/结束日期数据未输入!'};
        }
        if ((!startTime || !endTime) && !require) {
            return;
        }
        let _startTime = new Date(startTime);
        console.log(_startTime);
        let _endTime = new Date(endTime);
        if (_startTime.getTime() > _endTime.getTime()) {
            throw {'type': 'DataFormat', 'status': 5, 'message': field + '开始日期大于结束日期!'};
        }
    },

    intervalCheck(interval, require) {
        console.log('Interval:%s', interval);
        if (!interval && require) {
            throw {'type': 'DataFormat', 'status': 5, 'message': '返程间隔数据未输入'};
        }
        if (!interval && !require) {
            return;
        }
        let intervalResult = '';
        if (interval.search('-') > 0) {
            let start = interval.split('-')[0], stop = interval.split('-')[1];
            console.log('Start:[%s] Stop:[%s]', start, stop);
            if (!(start * 1 + stop * 1 >= 0)) {
                throw {'type': 'DataFormat', 'status': 5, 'message': '间隔天数格式不正确'};
            }
            if (stop - start > 15) {
                throw {'type': 'DataFormat', 'status': 5, 'message': '间隔天数大于15天'};
            }
            if (Number(stop) === 0){
                throw {'type': 'DataFormat', 'status': 5, 'message': '结束间隔天数不能为0'};
            }
            if (Number(start) > Number(stop)){
                throw {'type': 'DataFormat', 'status': 5, 'message': '起始天数大于结束天数'};
            }
            for (let i = start; i <= stop; i++) {
                if (intervalResult.length > 0) {
                    intervalResult = intervalResult + ',' + i;
                } else {
                    intervalResult = i + '';
                }
            }
            return intervalResult;
        }
        let _intervals = interval.split(',');
        for (let i = 0; i < _intervals.length; i++) {
            if (_intervals[i] * 1 < 0) {
                throw {'type': 'DataFormat', 'status': 5, 'message': '数字输入的格式不正确'};
            }
            if (intervalResult.length > 0) {
                intervalResult = intervalResult + ',' + _intervals[i];
            } else {
                intervalResult = _intervals[i];
            }
        }
        return intervalResult;
    }

}

export default validator;
