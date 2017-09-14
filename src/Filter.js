import React, {Component} from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class Filter extends Component {

    constructor() {
        super();
        this.state = {
            value: []
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(value) {
        this.setState({value});
    }

    render() {
        return (
            <div>
                <Select
                    multi
                    joinValues
                    value={this.state.value}
                    placeholder="Choose filter options"
                    onChange={this.handleSelectChange}
                    name="filter"
                    isLoading={this.props.isLoadingExternally}
                    options={this.props.options}
                />
            </div>
        );
    }
}

export default Filter;