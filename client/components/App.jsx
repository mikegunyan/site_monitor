import React from 'react';
import axios from 'axios';
import Visitors from './visitors';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      resume: []
    }
    this.getVisitors = this.getVisitors.bind(this);
  }

  componentDidMount() {
    this.getVisitors();
  }

  getVisitors() {
    axios.get('/visitors/resume')
      .then((data) => {
        this.setState({ resume : data.data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { resume } = this.state;
    return (
      <div>
        <Visitors site="Resume" visitors={resume} />
      </div>
    );
  }
}

export default App;
