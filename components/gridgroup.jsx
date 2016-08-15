var React = require('react');
var cloneWithProps = require('react-clonewithprops');
var BkCalendarMixin = require('../mixins/BkCalendarMixin');


module.exports = React.createClass({ //操作格子的變色
  mixins: [ BkCalendarMixin ],
  render: function() {
    return <div>{React.Children.map(this.props.children, this.renderItem)}</div>
  },
  renderItem: function(div, index){
    return cloneWithProps(div, { 
    // className: this.props.value === index ? 'active' : '',

     onClick: function(){
     var clickedData = "";
     if(index < this.props.bkcurDate.getDay()){
          //上月
            var prevMonthFirstDate = new Date(this.props.bkcurDate.getTime()); //複製目前的日期
            prevMonthFirstDate = new Date(prevMonthFirstDate.setMonth( this.props.bkcurDate.getMonth() - 1)),//設定上一月的日期 
            prevMonthDaysinMonth = new Date(prevMonthFirstDate.getFullYear(), prevMonthFirstDate.getMonth()+1, 0).getDate();// 取得上一月的天數
            var dayBefore  = this.props.bkcurDate.getDay()-1,
                prevMonth = prevMonthFirstDate.getMonth()+1;
            var prevMonthFormat = (prevMonth==0?12:prevMonth),
                prevDateFormat = prevMonthDaysinMonth + (index - dayBefore);

          prevMonthFormat = this.formatGenerator(prevMonthFormat);
          prevDateFormat = this.formatGenerator(prevDateFormat);
          clickedData = this.props.bkcurDate.getFullYear().toString() + prevMonthFormat.toString() + prevDateFormat.toString();

        } else if (index >= this.props.bkcurDate.getDay() && index < (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)) {
         //本月
          var day  = this.props.bkcurDate.getDay()-1, //取得星期顯示
              MonthFormat = this.props.bkcurDate.getMonth() + 1, //取得該月顯示
              dateFormat = index - day;
          MonthFormat = this.formatGenerator(MonthFormat);
          dateFormat = this.formatGenerator(dateFormat);
          clickedData = this.props.bkcurDate.getFullYear().toString() + MonthFormat.toString() + dateFormat.toString();

        } else if (index >= (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)){
          //下月
          var nextMonthFirstDate = new Date(this.props.bkcurDate.getTime());
              nextMonthFirstDate = new Date(nextMonthFirstDate.setMonth( this.props.bkcurDate.getMonth()+2));
          var dayAfter  = this.props.bkcurDate.getDay()-1,
              nextMonth = nextMonthFirstDate.getMonth();
          var nextMonthFormat = nextMonth==0?12:nextMonth,
              nextDateFormat = index - this.props.bkmonthDaysinMonth - dayAfter;

          nextMonthFormat = this.formatGenerator(nextMonthFormat);
          nextDateFormat = this.formatGenerator(nextDateFormat);
          clickedData = this.props.bkcurDate.getFullYear().toString() + nextMonthFormat.toString() + nextDateFormat.toString();
        }
        for(key in this.props.records){
          if (clickedData == key) {
           var recordTitle = this.props.records[key].title,
               recordContent = this.props.records[key].content;
          };
        }

        this.props.onChange(index, clickedData, recordTitle, recordContent); 
      }.bind(this)
    });
  }
});
