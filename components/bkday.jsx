var React = require('react');

module.exports = React.createClass({

  render: function() {
 <span className="dateDisplay">{this.props.curMonth} / {this.props.curDate}</span>
    return <div onClick={this.handleRecord} className={"day " + (this.props.marked?"marked ":"") + (this.props.today?"today ":"") + (this.props.activeStatus?"active":"")} >
      <span className="dateDisplay">{this.props.curMonth} / {this.props.curDate}</span> <br/> {this.props.title}
    </div>
  }
});
