var React = require('react');
var Reactfire = require('reactfire');
var Firebase = require('Firebase');
var rootUrl = 'https://bkcalendar.firebaseio.com/';
var BkCalendarMixin = require('../mixins/BkCalendarMixin');


module.exports = React.createClass({
  mixins: [ Reactfire, BkCalendarMixin ],
  getInitialState: function(){
    return {
      records:{},
      bullitinStatus: this.props.bullitinProp,
      title: null,
      content: null
    }
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
  <form>
  <h2 className="first-h2">on {this.props.clickedData}</h2>
    <fieldset>
      <h2>TITLE</h2>
    <input className="record-title" type="text" value={this.state.title}  onChange={this.handleTitle} />
    </fieldset>
    <fieldset>
      <h2>DESCRIPTION</h2>
      <textarea className="record-content" name="description" value={(this.state.content)?this.state.content:""}  onChange={this.handleContent} >
      </textarea>
    </fieldset>
      <div className="btn-wrapper"><input type="text" className="close" onClick={this.props.handleClose} value="CLOSE" />
      <input type="submit" className="submit" onClick={this.handleSubmit} value="SUBMIT" /></div>
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