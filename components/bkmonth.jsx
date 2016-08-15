var React = require('react');
var Reactfire = require('reactfire');

var GridGroup = require('./gridgroup');
var BkDay = require('./bkday');
var Bullitin = require('./bullitin');
var Firebase = require('Firebase');

var BkCalendarMixin = require('../mixins/BkCalendarMixin');

var rootUrl = 'https://bkcalendar.firebaseio.com/';


/* mixin補述
      Keep in mind that declaring a lifecycle method in a mixin does not override it on the component itself. 
      If you declare componentDidMount within your mixin and your component defines the same lifecycle method: 
      both will be called. Keep in mind that mixin lifecycle methods will always be called first, 
      followed by component lifecycle methods.
      我們可以用mixin來做lifecycle method的事情。mixin定義的方法並不會把react原生定義的同名方法蓋掉，但會先執行。
*/
module.exports = React.createClass({
  mixins: [ Reactfire, BkCalendarMixin ], //引入方法
  componentWillMount:function(){
    this.fb = new Firebase(rootUrl + 'records/');
    this.bindAsObject(this.fb, 'records');
    //we bound our data as an object to => "items" this.state.items
    this.fb.on('value', this.handleDataLoaded, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  handleDataLoaded: function(){
  },
  getInitialState: function(){
    return {
      selected: null,
      clickedData: null,
      records: {},
      bullitinStatus: false,
      marked: true,
      title: null,
      content: null
    }
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
           var activeStatus = false;
          prevMonthFormat = this.formatGenerator(prevMonthFormat);
          prevDateFormat = this.formatGenerator(prevDateFormat);
          var dateStr = prevMonthFirstDate.getFullYear() + prevMonthFormat + prevDateFormat;
          if (i == this.state.selected) {
             activeStatus = true;
          };
          var dateJSX = <div 
                             className="grid"
                             key={i} >
                              <BkDay activeStatus={activeStatus} curDate={prevDateFormat} curMonth={prevMonthFormat} />
                        </div>

          for(var key in this.state.records) {
              if(dateStr == key){
                dateJSX = <div 
                  className="grid"
                  key={i} >
                     <BkDay marked={this.state.marked} title={this.state.records[key].title} activeStatus={activeStatus} curDate={prevDateFormat} curMonth={prevMonthFormat} />
                  </div>
                } 
          }

       grids.push(
          dateJSX
        );
     } 
     //該月份顯示
     else if( i >= this.props.bkcurDate.getDay() && i < (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)) {
       var day  = this.props.bkcurDate.getDay()-1, //取得星期顯示
           MonthFormat = this.props.bkcurDate.getMonth() + 1, //取得該月顯示
           dateFormat = i - day;
           var activeStatus = false;
           //var today = false;
           MonthFormat = this.formatGenerator(MonthFormat);
           dateFormat = this.formatGenerator(dateFormat);

          var dateStr = this.props.bkcurDate.getFullYear() + MonthFormat + dateFormat;
          if (i == this.state.selected) {
             activeStatus = true;
          };
          var dateJSX = <div 
                             className="grid this-month" 
                             key={i} >
                              <BkDay today={(dateStr === this.props.todayStr)?true:false} activeStatus={activeStatus} curDate={dateFormat} curMonth={MonthFormat} />
                        </div>

          for(var key in this.state.records) {
              if(dateStr == key){
                dateJSX = <div 
                  className="grid this-month" 
                  key={i} >
                     <BkDay marked={this.state.marked} title={this.state.records[key].title} today={(dateStr === this.props.todayStr)?true:false}  activeStatus={activeStatus} curDate={dateFormat} curMonth={MonthFormat} />
                  </div>
                } 
          }
       grids.push(
          dateJSX
        );
     //月份以後顯示
     } else if(i >= (this.props.bkcurDate.getDay() + this.props.bkmonthDaysinMonth)){
        var nextMonthFirstDate = new Date(this.props.bkcurDate.getTime());
            nextMonthFirstDate = new Date(nextMonthFirstDate.setMonth( this.props.bkcurDate.getMonth()+2));
        var dayAfter  = this.props.bkcurDate.getDay()-1,
            nextMonth = nextMonthFirstDate.getMonth();
        var nextMonthFormat = nextMonth==0?12:nextMonth,
            nextDateFormat = i - this.props.bkmonthDaysinMonth - dayAfter;
        var activeStatus = false;
        nextMonthFormat = this.formatGenerator(nextMonthFormat);
        nextDateFormat = this.formatGenerator(nextDateFormat);


          var dateStr = this.props.bkcurDate.getFullYear() + nextMonthFormat + nextDateFormat;
          if (i == this.state.selected) {
             activeStatus = true;
          };
          var dateJSX = <div 
                             className="grid" 
                             key={i} >
                              <BkDay activeStatus={activeStatus} curDate={nextDateFormat} curMonth={nextMonthFormat} />
                        </div>
          for(var key in this.state.records) {
              if(dateStr == key){
                dateJSX = <div 
                  className="grid" 
                  key={i} >
                     <BkDay marked={this.state.marked} title={this.state.records[key].title} activeStatus={activeStatus} curDate={nextDateFormat} curMonth={nextMonthFormat} />
                  </div>
                } 
          }
       grids.push(
          dateJSX
        );
     }
    };

   return  (<div className="app-content-wrapper">
     {/* nav 為header，包含add delete  detail按鈕。 */}
       <nav>
          <div className="date-title">
              <span>{this.props.bkcurDate.getFullYear()}/</span>
              <span>{this.props.bkcurDate.getMonth() + 1 }/</span>
              <span>{this.props.bkcurDate.getDate()}</span>
          </div>
          <img className="logo" src="./logo.png" />
             {this.handleBkDayDisplay()}
             {this.handleDeleteDisplay()}
       </nav>
      <div className="grid-title">SUN</div>
      <div className="grid-title">MON</div>
      <div className="grid-title">TUE</div>
      <div className="grid-title">WED</div>
      <div className="grid-title">THU</div>
      <div className="grid-title">FRI</div>
      <div className="grid-title">SAT</div>
    {/* GridGroup 為日曆內的方格。 */}
      <GridGroup 
          bkcurDate={this.props.bkcurDate}  
          bkmonthDaysinMonth={this.props.bkmonthDaysinMonth} 
          records={this.state.records} 
          onChange={this.handleChange}  
          value={this.state.selected}
      >
      {grids}
      </GridGroup>
     {/* Bullitin為點擊add detail之後的彈出框。 */}
       <Bullitin records={this.state.records} clickedData={this.state.clickedData}  title={this.state.title}  content={this.state.content}  handleClose={this.handleClose} handleSubmit={this.handleSubmit} bkcurDate={this.props.bkcurDate}  bullitinProp={this.state.bullitinStatus} />
      </div>)
  },
  handleChange: function(selected, clickedData, title, content){
    // alert(selected);
    this.setState({
      selected: selected,
      clickedData: clickedData,
      title: title,
      content: content
    });
  },
  addBkDay: function(){
    this.setState({
      bullitinStatus: true,
      oriContent: false
    });
  },
  detailBkDay: function(){
    this.setState({
      bullitinStatus: true,
      oriContent: true
    });
  },
  handleBkDayDisplay: function(){
   if(!this.state.clickedData) {
     return null;
   } else {
      if (!this.state.title) {
         return <button className="add" 
         onClick={this.addBkDay}
         >
         ADD
       </button>
      } else {
         return <button className="detail" 
         onClick={this.detailBkDay}
         >
         DETAIL
         </button>
     }
   };
  },
  handleDelete: function(){
    var DeletedData = new Firebase(rootUrl + "records/" + this.state.clickedData);
    DeletedData.remove();
  },
  handleDeleteDisplay: function(){
   if(!this.state.clickedData) {
     return null;
   } else {
      if (!this.state.title) {
         return;
      } else {
         return <button  className="delete" 
         onClick={this.handleDelete}
         >
         DELETE
         </button>
     }
   };
  },
  handleClose: function(){
    this.setState({
      bullitinStatus: false,
      content: null
    });
  }
});