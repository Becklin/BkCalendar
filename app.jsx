var React = require('react');
var Firebase = require('Firebase');
var Reactfire = require('reactfire');
var rootUrl = 'https://shining-fire-6582.firebaseio.com/';
var cloneWithProps = require('react-clonewithprops');

var BkCalendarMixin = {
   formatGenerator : function (time){
        if (time.toString().length == 1) {
         time = "0" + time;
        };
        return time.toString();
   }
};


var Header = React.createClass({
  render: function() {
    return <nav className="nav">
    <span>{this.props.curDate.getFullYear()}</span>
    <span>{this.props.curDate.getMonth() + 1 }</span>
    <span>{this.props.curDate.getDate()}</span>
    </nav>
  },
  handleSubmit: function(){
    this.props.recordsStore.push({ // push: is a firebase method we create new object to our remote database
      title: "我是標題", //this.state.title,
      content: "我是內文", //this.state.content,
      done: false //set flase means we havnt complete the todo item.
    });
  }
});
var Bullitin = React.createClass({
  render: function() {
    return <div  className="bullitin" >
      
    </div>
  }
});

var BkDay = React.createClass({
  render: function() {
    return <div onClick={this.handleRecord} className="day" >
      {this.props.curMonth}月{this.props.curDate}日
    </div>

  }
});

var GridGroup = React.createClass({ //操作格子的變色
  mixins: [ BkCalendarMixin ],
  render: function() {
    return <div>{React.Children.map(this.props.children, this.renderItem)}</div>
  },
  renderItem: function(div, index){
    return cloneWithProps(div, { 
      className: this.props.value === index ? 'active' : '',

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
        this.props.onChange(index, clickedData); 
      }.bind(this)
    });
  }
});

var BkMonth = React.createClass({
  mixins: [ Reactfire, BkCalendarMixin ],
  componentWillMount:function(){
    this.fb = new Firebase(rootUrl + 'records/');
    this.bindAsObject(this.fb, 'records');
    //this.fb.on('value', this.handleDataLoaded);
  },
  getInitialState: function(){
    return {
      selected: null,
      records2: this.props.records
    }
  },
  componentWillRecieveProps: function(){

  },
  render: function() {
   var grids = [];
    for (var i = 0; i < 42; i++) {
      //該月份以前顯示
     if(i < this.props.bkcurDate.getDay()){
            var prevMonthFirstDate = new Date(this.props.bkcurDate.getTime()); //複製目前的日期
            prevMonthFirstDate = new Date(prevMonthFirstDate.setMonth( this.props.bkcurDate.getMonth() - 1)),//設定上一月的日期 
            prevMonthDaysinMonth = new Date(prevMonthFirstDate.getFullYear(), prevMonthFirstDate.getMonth()+1, 0).getDate();// 取得上一月的天數
            var dayBefore  = this.props.bkcurDate.getDay()-1,
                prevMonth = prevMonthFirstDate.getMonth()+1;
            var prevMonthFormat = (prevMonth==0?12:prevMonth),
                prevDateFormat = prevMonthDaysinMonth + (i - dayBefore);

          prevMonthFormat = this.formatGenerator(prevMonthFormat);
          prevDateFormat = this.formatGenerator(prevDateFormat);

       grids.push(
          <div 
          className="grid" 
          key={i} >
             <BkDay curDate={prevDateFormat} curMonth={prevMonthFormat} />
          </div>
        );
     } 
     //該月份顯示
     else if( i >= this.props.bkcurDate.getDay() && i < (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)) {
       var day  = this.props.bkcurDate.getDay()-1, //取得星期顯示
           MonthFormat = this.props.bkcurDate.getMonth() + 1, //取得該月顯示
           dateFormat = i - day;

           MonthFormat = this.formatGenerator(MonthFormat);
           dateFormat = this.formatGenerator(dateFormat);

       grids.push(
          <div 
          className="grid this-month" 
          key={i} >
            <BkDay curDate={dateFormat} curMonth={MonthFormat} />
          </div>
        );
     //月份以後顯示
     } else if(i >= (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)){
        var nextMonthFirstDate = new Date(this.props.bkcurDate.getTime());
            nextMonthFirstDate = new Date(nextMonthFirstDate.setMonth( this.props.bkcurDate.getMonth()+2));
        var dayAfter  = this.props.bkcurDate.getDay()-1,
            nextMonth = nextMonthFirstDate.getMonth();
        var nextMonthFormat = nextMonth==0?12:nextMonth,
            nextDateFormat = i - this.props.bkmonthDaysinMonth - dayAfter;

        nextMonthFormat = this.formatGenerator(nextMonthFormat);
        nextDateFormat = this.formatGenerator(nextDateFormat);

       grids.push(
          <div 
          className="grid" 
          key={i} >
             <BkDay curDate={nextDateFormat} curMonth={nextMonthFormat} />
          </div>
        );
     }
    };
    console.log(MonthFormat.toString() + " - " + dateFormat.toString());
   return  <div>
   <nav>
   <button onClick={this.handleAdd}>ADD</button>
   <button ref="keke" value="bubu">DETAIL</button>
   <button>DELETE</button>
   </nav>
              <div className="grid-title">SUN</div>
              <div className="grid-title">MON</div>
              <div className="grid-title">TUE</div>
              <div className="grid-title">WED</div>
              <div className="grid-title">THU</div>
              <div className="grid-title">FRI</div>
              <div className="grid-title">SAT</div>

   <GridGroup bkcurDate={this.props.bkcurDate}  bkmonthDaysinMonth={this.props.bkmonthDaysinMonth}  records={this.state.records} recordsStore={this.firebaseRefs.records} onChange={this.handleChange}  value={this.state.selected}>
    {grids}
   </GridGroup>
   <Bullitin/>
  </div>
  },
  handleChange: function(selected, clickedData){
    this.setState({
      selected: selected,
      clickedData: clickedData
    });
  },
  handleAdd: function(selected){
    var content = this.state.clickedData;
    //alert(content);
  }
});

var App = React.createClass({
  mixins: [ Reactfire ],
  componentWillMount:function(){
    this.fb = new Firebase(rootUrl + 'records/');
    this.bindAsObject(this.fb, 'records');
    //we bound our data as an object to => "items" this.state.items
   // this.fb.on('value', this.handleDataLoaded);
  },
  getInitialState: function(){
    return {
        records: {}, 
        curDate: this.props.curDate,
        title: "",
        monthDaysinMonth: this.props.monthDaysinMonth
    }
  },
  render: function() {
    return <div className="app">
             <Header curDate={this.state.curDate}  recordsStore={this.firebaseRefs.records} />
              <hr />
             <BkMonth records={this.firebaseRefs.records}  bkcurDate={this.state.curDate} bkmonthDaysinMonth={this.state.monthDaysinMonth}  />
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

var curDate =  new Date(),   //本日
    monthDaysinMonth = new Date(curDate.getFullYear(), curDate.getMonth()+1, 0).getDate(); //該月有幾天

var options = {
      curDate: curDate,   //本日
      monthDaysinMonth:  monthDaysinMonth  //該月有幾天
}

var element = React.createElement(App, options);
React.render(element, document.querySelector('.container'));

