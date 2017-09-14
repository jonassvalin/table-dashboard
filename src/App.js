import React, {Component} from 'react';
import Elasticsearch from 'elasticsearch';
import 'react-select/dist/react-select.css';
import Filter from "./Filter";

class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoadingExternally: true
        };
        this.getOptions().then((response) => {
            let options = this.transformFilterOptions(response);
            this.setState({
                isLoadingExternally: false,
                options: options
            })
        });
    }

    transformFilterOptions(response) {
        return response.map((entry) => {
            return { value: entry.key, label: entry.key }
        })
    }

    getOptions() {
        const client = new Elasticsearch.Client({
            host: '',
            log: 'debug'
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

        return client.search({
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
                "aggs": {
                    "langs": {
                        "terms": {"field": "businessModel", "size": 100}
                    }
                }
            }
        }).then(function (response) {
            return response.aggregations.langs.buckets;
        });
    };

    render() {
        return (
            <div>
                <Filter isLoadingExternally={this.state.isLoadingExternally} options={this.state.options}/>
            </div>
        );
    }
}

export default App;
