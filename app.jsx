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


// var Header = React.createClass({
//   render: function() {
//     return <nav className="nav">
//     <span>{this.props.curDate.getFullYear()}</span>
//     <span>{this.props.curDate.getMonth() + 1 }</span>
//     <span>{this.props.curDate.getDate()}</span>
//     </nav>
//   }
// });
var Bullitin = React.createClass({
  mixins: [ Reactfire, BkCalendarMixin ],
  getInitialState: function(){
    return {
      records:{},
      bullitinStatus: this.props.bullitinProp,
      title: null,
      content: null
    }
  },
  componentWillMount: function(){

  },
  componentWillReceiveProps: function(nextProps){ //第一次render不會跑
      this.setState({
        bullitinStatus: nextProps.bullitinProp,
        title: nextProps.title,
        content: nextProps.content
      })

  },
  render: function() {
  return <div className={"bullitin " + (this.state.bullitinStatus == true?"show":"hide")}>
  <button onClick={this.props.handleClose}>CLOSE</button>
  <button onClick={this.handleSubmit}>SUBMIT</button>
  <form>
  <h2>{this.props.clickedData}</h2>
    <fieldset>
      <h2>TITLE</h2>
    <input className="record-title" type="text" value={this.state.title}  onChange={this.handleTitle} />
    </fieldset>
    <fieldset>
      <h2>DESCRIPTION</h2>
      <textarea className="record-content" name="description" value={this.state.content}  onChange={this.handleContent} >
      </textarea>
    </fieldset>
  </form>
    </div>
  },
  handleTitle: function(event){
    this.setState({
      title: event.target.value.substr(0, 15)
    })
  },
  handleContent: function(event){
    this.setState({
      content: event.target.value.substr(0, 240)
    })
  },
  handleSubmit: function(){
    this.ref = new Firebase(rootUrl + 'records/');
    this.bindAsObject(this.ref, 'records');
    //we bound our data as an object to => "items" this.state.items
    this.ref.on('value', function(){
          this.ref.child(this.props.clickedData).set({ // push: is a firebase method we create new object to our remote database
          title: this.state.title, //this.state.title,
          content: this.state.content, //this.state.content,
          done: false //set false means we havnt complete the todo item.
        },function(){
          console.log("SUCCESS!");
          this.setState({
            bullitinStatus: false
          })
          this.props.handleClose();
        }.bind(this));
    }.bind(this));
  },
  handleDeleteClick: function() {
    this.fb.remove();
  }
});

var BkDay = React.createClass({

  render: function() {
 <span className="dateDisplay">{this.props.curMonth} / {this.props.curDate}</span>
    return <div onClick={this.handleRecord} className={"day " + (this.props.marked?"marked ":"") + (this.props.today?"today ":"") + (this.props.activeStatus?"active":"")} >
      <span className="dateDisplay">{this.props.curMonth} / {this.props.curDate}</span> <br/> {this.props.title}
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
      // if (this.props.value === index) {
      //   alert("bingo");
      // };
        this.props.onChange(index, clickedData, recordTitle, recordContent); 
      }.bind(this)
    });
  }
});

var BkMonth = React.createClass({
  mixins: [ Reactfire, BkCalendarMixin ],
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

   return  <div>
   <nav>

    <span>{this.props.bkcurDate.getFullYear()}</span>
    <span>{this.props.bkcurDate.getMonth() + 1 }</span>
    <span>{this.props.bkcurDate.getDate()}</span>

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

   <GridGroup 
      bkcurDate={this.props.bkcurDate}  
      bkmonthDaysinMonth={this.props.bkmonthDaysinMonth} 
      records={this.state.records} 
      onChange={this.handleChange}  
      value={this.state.selected}
    >
    {grids}
   </GridGroup>
   <Bullitin records={this.state.records} clickedData={this.state.clickedData}  title={this.state.title}  content={this.state.content}  handleClose={this.handleClose} handleSubmit={this.handleSubmit} bkcurDate={this.props.bkcurDate}  bullitinProp={this.state.bullitinStatus} />
  </div>
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
  handleBkDay: function(){
    this.setState({
      bullitinStatus: true
    });
  },
  handleBkDayDisplay: function(){
   if(!this.state.clickedData) {
     return null;
   } else {
      if (!this.state.title) {
         return <button className="add" 
         onClick={this.handleBkDay}
         >
         ADD
       </button>
      } else {
         return <button className="detail" 
         onClick={this.handleBkDay}
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

var App = React.createClass({
  mixins: [ Reactfire ],
  getInitialState: function(){
    return {
        records: {}, 
        curDate: this.props.curDate,
        todayStr: this.props.todayStr,
        title: "",
        monthDaysinMonth: this.props.monthDaysinMonth
    }
  },
  render: function() {
    return <div className="app">
              <hr />
             <BkMonth bkcurDate={this.state.curDate} bkmonthDaysinMonth={this.state.monthDaysinMonth} todayStr={this.state.todayStr} />
             <button  className="prev-month" onClick={this.prevMonth}>PREV MONTH</button>
             <button  className="next-month" onClick={this.nextMonth}>NEXT MONTH</button>
             <button  className="today" onClick={this.showToday}>TODAY</button>

          </div>
  },
  showToday: function(){
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

var curDate =  new Date(),   //本日
    monthDaysinMonth = new Date(curDate.getFullYear(), curDate.getMonth()+1, 0).getDate(); //該月有幾天

var options = {
      curDate: curDate,   //本日
      monthDaysinMonth:  monthDaysinMonth,  //該月有幾天,
      todayStr: curDate.getFullYear().toString() + (curDate.getMonth() + 1).toString() + curDate.getDate().toString()
}

var element = React.createElement(App, options);
React.render(element, document.querySelector('.container'));

