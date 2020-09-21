const validatePattern = require('./pattern-validation');
const convertExpression = require('./convert-expression');
const luxon = require('luxon');

function matchPattern(pattern, value){
    if( pattern.indexOf(',') !== -1 ){
        var patterns = pattern.split(',');
        return patterns.indexOf(value.toString()) !== -1;
    }
    return pattern === value.toString();
}

class TimeMatcher{
    constructor(pattern, timezone){
        validatePattern(pattern);
        this.pattern = convertExpression(pattern);
        this.timezone = timezone;
        this.expressions = this.pattern.split(' ');
    }

    match(date){
        date = this.apply(date);
        var runOnSecond = matchPattern(this.expressions[0], date.getSeconds());
        var runOnMinute = matchPattern(this.expressions[1], date.getMinutes());
        var runOnHour = matchPattern(this.expressions[2], date.getHours());
        var runOnDay = matchPattern(this.expressions[3], date.getDate());
        var runOnMonth = matchPattern(this.expressions[4], date.getMonth() + 1);
        var runOnWeekDay = matchPattern(this.expressions[5], date.getDay());

        return runOnSecond && runOnMinute && runOnHour && runOnDay && runOnMonth && runOnWeekDay;
    }

    apply(date) {
        if (this.timezone) {
            const tmp = luxon.DateTime.local(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()).setZone(this.timezone);
            return new Date(tmp.year, tmp.month, tmp.day, tmp.hour, tmp.minute, tmp.second, tmp.millisecond);
        }
        return date;
    }
}

module.exports = TimeMatcher;