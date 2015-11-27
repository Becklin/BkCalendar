var React = require('react');

var App = React.createClass({
  render: function() {
    return <div className="">
      我是日曆
    </div>
  }
});

var element = React.createElement(App, {});
React.render(element, document.querySelector('.container'));