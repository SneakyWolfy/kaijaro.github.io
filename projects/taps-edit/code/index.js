'use strict';
var $ = (id) => {
    return document.querySelector(id);
}

//doc movment commands
/*
var test = new Vue({
    el: '#testDrag',
    methods: {
      grab: function(event){
        event.target.addEventListener(event.target.id+'Grab', freeze)
      }
    }
  })

*/
  //doc html stuff

const e = React.createElement;

class testDrag extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = $('#testDrag');
ReactDOM.render(e(testDrag), domContainer);