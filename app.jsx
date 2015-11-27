var React = require('react');



var BkDay = React.createClass({
  render: function() {
    return <span className="">
    	日
    </span>
  }
});

var BkMonth = React.createClass({
  render: function() {
  var indents = [];
  for (var i = 0; i < this.props.curDaysinMonth; i++) {
    indents.push("<BkDay className='indent' key=" + i + "></BkDay>");
  }
  return ( <div>
    {indents}
    </div>
  )
  }
});

var Header = React.createClass({
  render: function() {
    return <nav className="">
     <button type="button">DELETE</button>
     <button type="button">ADD</button>
     <button type="button">DETAIL</button>
    </nav>
  }
});

var App = React.createClass({
  getInitialState: function(){
    var curDate  = new Date(),
        curYear  = curDate.getFullYear(),
        curMonth = curDate.getMonth()+1,
        curDay   = curDate.getDay(),
        curDaysinMonth =  new Date(curYear, curMonth, 0).getDate();

        console.log(curDaysinMonth);

    return {
        curDaysinMonth: curDaysinMonth
    }
  },
  render: function() {
    return <div className="app">
             <Header/>
             <BkMonth curDaysinMonth={this.state.curDaysinMonth} />
          </div>
  }
});

var element = React.createElement(App, {});
React.render(element, document.querySelector('.container'));

/*
<Header />
<BkMonth>
  <BkDay>
    <Memo>
    <Title>
*/