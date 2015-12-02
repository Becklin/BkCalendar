var React = require('react');
var Firebase = require('Firebase');
var Reactfire = require('reactfire');
var rootUrl = 'https://shining-fire-6582.firebaseio.com/';


var BkDay = React.createClass({
  render: function() {
    return <div className="day">
      {this.props.curMonth}月{this.props.curDate}日
    </div>
  }
});


var BkMonth = React.createClass({

  componentDidMount: function(){

  },
  render: function() {
  var grids = [];
    for (var i = 0; i < 42; i++) {
      //該月份顯示
      if(i >= this.props.bkcurDate.getDay() && i < (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)) {
        var t  = this.props.bkcurDate.getDay()-1;
        grids.push(<div className="grid this-month" key={i} ><BkDay curDate={i - t} curMonth={this.props.bkcurDate.getMonth() + 1} /></div>);
      //月份以外顯示
      } else {
        grids.push(<div className="grid" key={i} ></div>);
      }
    }
  return  <div>
              <div className="grid-title">SUN</div>
              <div className="grid-title">MON</div>
              <div className="grid-title">TUE</div>
              <div className="grid-title">WED</div>
              <div className="grid-title">THU</div>
              <div className="grid-title">FRI</div>
              <div className="grid-title">SAT</div>
        <div>
    {grids}
  </div>
  </div>
  }
});

var Header = React.createClass({
  render: function() {
    return <nav className="nav">
    <span>{this.props.curDate.getFullYear()}</span>
    <span>{this.props.curDate.getMonth() + 1 }</span>
    <span>{this.props.curDate.getDate()}</span>
     <button type="button">DELETE</button> 
     <button type="button">ADD</button>
     <button type="button">DETAIL</button>
    </nav>
  }
});

var App = React.createClass({
  mixins: [ Reactfire ],
  getInitialState: function(){
    return {
      records: {}
    }
  },
  componentWillMount:function(){
    this.fb = new Firebase(rootUrl + 'records/');
    this.bindAsObject(this.fb, 'records');
    //this.fb.on('value', this.handleDataLoaded);
  },
  getInitialState: function(){
    return {
        curDate: this.props.curDate,
        monthDaysinMonth: this.props.monthDaysinMonth
    }
  },
  render: function() {

    return <div className="app">
             <Header curDate={this.state.curDate} />
             <BkMonth bkcurDate={this.state.curDate} bkmonthDaysinMonth={this.state.monthDaysinMonth}  />
             <button onClick={this.prevMonth}>PREV MONTH</button>
             <button onClick={this.nextMonth}>NEXT MONTH</button>
          </div>
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
    // _minutes: 1000 * 60,
    // _hours: 1000 * 60 * 60,
    //_days: 1000 * 60 * 60 * 24, //每天的毫秒數。
    // _years: 1000 * 60 * 60 * 24 * 365,


var curDate =  new Date(),   //本日
    monthDaysinMonth = new Date(curDate.getFullYear(), curDate.getMonth()+1, 0).getDate(); //該月有幾天

var options = {
        curDate: curDate,   //本日
        monthDaysinMonth:  monthDaysinMonth  //該月有幾天
}
var element = React.createElement(App, options);
React.render(element, document.querySelector('.container'));

