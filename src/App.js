import React, { Component } from 'react';
import Select from 'react-select';
import Elasticsearch from 'elasticsearch';
import 'react-select/dist/react-select.css';

let options = [];

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: []
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount () {
    const client = new Elasticsearch.Client({
      host: '',
      log: 'trace'
    });

    client.ping({
      requestTimeout: 30000,
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
      }
    });

    this.serverRequest = client.search({
      index: 'products',
      type: 'product',
      body: {
        "size": 0,
        "query": {
          "bool": {
            "must": [
              {
                "match_all": {}
              },
              {
                "range": {
                  "lastExported": {
                    "from": "now/d"
                  }
                }
              }
            ],
            "must_not": []
          }
        },
        "aggs" : {
          "langs" : {
            "terms" : { "field" : "businessModel",  "size" : 100 }
          }
        }}
    }).then(function (resp) {
      options = resp.aggregations.langs.buckets;
      console.log(options);
    }, function (err) {
      console.trace(err.message);
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  handleSelectChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <div>
        <Select multi
                joinValues
                value={this.state.value}
                placeholder="Select your favourite(s)"
                options={options}
                onChange={this.handleSelectChange} />
      </div>
    );
  }
}

export default App;
