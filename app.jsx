var React = require('react');
var Firebase = require('Firebase');
var Reactfire = require('reactfire');
var rootUrl = 'https://shining-fire-6582.firebaseio.com/';
var cloneWithProps = require('react-clonewithprops');

var BkDay = React.createClass({
  getInitialState: function(){
    return {

    }
  },
  render: function() {
    return <div onClick={this.handleRecord} className="day" ><input />
      {this.props.curMonth}月{this.props.curDate}日
    </div>

  },
  handleRecord: function(){
alert("jomi");
    return <div className="btn-group">
     <button type="button">DELETE</button> 
     <button type="button" onClick={this.handleSubmit}>ADD</button>
     <button type="button">DETAIL</button>
    </div>
  }
});

var GridGroup = React.createClass({
  render: function() {
    return <div>{React.Children.map(this.props.children, this.renderItem)}</div>
  },
  renderItem: function(div, index){
    return cloneWithProps(div, { className: this.props.value === index ? 'active' : '',
      onClick: function(){ 
        this.props.onChange(index); 
      }.bind(this)
    });
  }
});

var BkMonth = React.createClass({
  getInitialState: function(){
    return {
      selected: null,
      records2: this.props.records
    }
  },
  componentDidMount: function(){
    console.log("records2 = " + Object.keys(this.state.records2));
 
  },
  render: function() {
  var grids = [];
    for (var i = 0; i < 42; i++) {
      //該月份以前顯示
     if(i < this.props.bkcurDate.getDay()){
            var prevMonthFirstDate = new Date(this.props.bkcurDate.getTime());
            prevMonthFirstDate = new Date(prevMonthFirstDate.setMonth( this.props.bkcurDate.getMonth() - 1)), 
            prevMonthDaysinMonth = new Date(prevMonthFirstDate.getFullYear(), prevMonthFirstDate.getMonth()+1, 0).getDate();
            var dayBefore  = this.props.bkcurDate.getDay()-1;
            var prevMonth = prevMonthFirstDate.getMonth()+1;

       grids.push(<div className="grid" key={i} ><BkDay curDate={prevMonthDaysinMonth + (i - dayBefore)} curMonth={(prevMonth==0?12:prevMonth)} /></div>);
     } 
     //該月份顯示
     else if( i >= this.props.bkcurDate.getDay() && i < (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)) {
       var day  = this.props.bkcurDate.getDay()-1;
       grids.push(<div className="grid this-month" key={i} ><BkDay onHandler={this.handleBtn} curDate={i - day} curMonth={this.props.bkcurDate.getMonth() + 1} /></div>);
     //月份以後顯示
     } else if(i >= (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)){
        var nextMonthFirstDate = new Date(this.props.bkcurDate.getTime());
            nextMonthFirstDate = new Date(nextMonthFirstDate.setMonth( this.props.bkcurDate.getMonth()+2));
        var dayAfter  = this.props.bkcurDate.getDay()-1;
        var nextMonth = nextMonthFirstDate.getMonth();
         console.log(nextMonth);
       grids.push(<div className="grid" key={i} ><BkDay curDate={i - this.props.bkmonthDaysinMonth - dayAfter} curMonth={(nextMonth==0?12:nextMonth)} /></div>);
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
   <GridGroup onChange={this.handleChange}  value={this.state.selected}>
    {grids}
   </GridGroup>
  </div>
  },
  handleBtn: function(){

  },
  handleChange: function(selected){
    this.setState({
      selected: selected,
    });
  }
});

var Header = React.createClass({
  getInitialState: function(){
    return {

    }
  },
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
  },
  handleDelete: function(){

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
    console.log("records = " + Object.keys(this.state.records));
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

            var dataArray = [];

            for (var i = 0; i <= 42; i++) {
              dataArray.push({
                "year":nextMonthFirstDate.getFullYear(),
                "month":nextMonthFirstDate.getMonth(),
                "date": i
              });
            }
            this.setState({
                curDate: nextMonthFirstDate,
                monthDaysinMonth: nextMonthDaysinMonth,
                dataRecords:dataArray
            });
            //console.log(this.state.dataRecords);
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

