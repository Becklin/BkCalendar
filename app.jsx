var React = require('react');
var Reactfire = require('reactfire');
var cloneWithProps = require('react-clonewithprops');

var BkMonth = require('./components/bkmonth');


var curDate =  new Date(),   //本日
    monthDaysinMonth = new Date(curDate.getFullYear(), curDate.getMonth()+1, 0).getDate(); //該月有幾天

var options = {
      curDate: curDate,   //本日
      monthDaysinMonth:  monthDaysinMonth,  //該月有幾天,
      todayStr: curDate.getFullYear().toString() + (curDate.getMonth() + 1).toString() + curDate.getDate().toString()
}




var App = React.createClass({
  getInitialState: function(){
    return {
        // records: {}, 
        curDate: this.props.curDate,
        todayStr: this.props.todayStr,
        //title: "",
        monthDaysinMonth: this.props.monthDaysinMonth //初始化該月有幾天
    }
  },
  render: function() {
    return <div className="app">
             <BkMonth bkcurDate={this.state.curDate} bkmonthDaysinMonth={this.state.monthDaysinMonth} todayStr={this.state.todayStr} />
             <button  className="prev-month" onClick={this.prevMonth}>PREV MONTH</button>
             <button  className="next-month" onClick={this.nextMonth}>NEXT MONTH</button>
             <button  className="today" onClick={this.showThisMonth}>THIS MONTH</button>
          </div>
  },
  showThisMonth: function(){
        var curDate =  new Date(),   //本日
            monthDaysinMonth = new Date(curDate.getFullYear(), curDate.getMonth()+1, 0).getDate(); //該月有幾天
            this.setState({
                curDate: curDate,
                monthDaysinMonth: monthDaysinMonth
            });
  },
  nextMonth: function(){
        var curDate = this.state.curDate,
            nextDate = new Date(curDate.getTime()),
            nextMonthFirstDate = new Date(nextDate.setMonth( curDate.getMonth() + 1)), 
            nextMonthDaysinMonth = new Date(nextDate.getFullYear(), nextDate.getMonth()+1, 0).getDate();

            this.setState({
                curDate: nextMonthFirstDate,
                monthDaysinMonth: nextMonthDaysinMonth
            });
  },
  prevMonth:function(){
        var curDate = this.state.curDate,
            prevDate = new Date(curDate.getTime()),
            prevMonthFirstDate = new Date(prevDate.setMonth( curDate.getMonth() - 1)), 
            prevMonthDaysinMonth = new Date(prevDate.getFullYear(), prevDate.getMonth()+1, 0).getDate();

            this.setState({
                curDate: prevMonthFirstDate,
                monthDaysinMonth: prevMonthDaysinMonth
            });
  }
});

var element = React.createElement(App, options);
React.render(element, document.querySelector('.container'));

