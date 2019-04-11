import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTimes, faEye, faSortDown, faSortUp, faPlus} from "@fortawesome/free-solid-svg-icons";
import _ from "underscore";
import $ from "jquery";
import "./crud-table.scss"
export default class CRUDTable extends React.Component{
    constructor(props) {
        super(props);
        let filter = {};
        if (this.props.filter === true) {
            _.range(this.props.rows.length).forEach((val) => {
                filter[val] = ""
            })
        } else if (_.isArray(this.props.filter)) {
            this.props.filter.forEach((val) => {
                filter[val] = ""
            })
        }
        this.state = {
            sortIndex: 0,
            sortAscending: false,
            pageItemCount: 10,
            page: 1,
            filter: filter
        }
    }

    sortRow(rows) {
        let sorted = [ ...rows ];
        if (this.props.canSort) {
            sorted = sorted.sort((a, b) => {
                let rtn = 0;
                if (a.cell[this.state.sortIndex] > b.cell[this.state.sortIndex]) {
                    rtn =  1;
                }
                if (a.cell[this.state.sortIndex] < b.cell[this.state.sortIndex]) {
                    rtn = -1;
                }
                if (this.state.sortAscending) {
                    return rtn;
                } else {
                    return -rtn;
                }

            });
        }
        return sorted;
    }

    filterRow(rows) {
        let filtered = [ ...rows ];
        filtered = _.filter(filtered, (row) => {
            let isFiltered = false;
            _.mapObject(this.state.filter, (val, index) => {
                isFiltered = isFiltered || (val !== "" && row.cell[index] !== val);
            });
            return !isFiltered;
        });
        return filtered;
    }

    renderRow(rows) {
        rows = rows.slice(this.state.pageItemCount * (this.state.page - 1), this.state.pageItemCount * this.state.page);
        return $.map(rows, (row, rIndex) => {
            let cell = $.map(row.cell, (val, cIndex) => {
                return <td key={cIndex} className={"align-middle"}>{ val }</td> ;
            });
            let canRead = row.canRead || (this.props.onRead && row.canRead !== false);
            let canUpdate = row.canUpdate || (this.props.onUpdate && row.canUpdate !== false);
            let canDelete = row.canDelete || (this.props.onDelete && row.canDelete !== false);
            return (
                <tr key={rIndex}>
                    { cell }
                    {canRead || canUpdate || canDelete ? (
                        <td className={"align-middle"}>
                            <div className={"d-flex justify-content-center align-items-center"}>
                                {canRead ? (
                                    <button className={"btn btn-link btn-sm"} onClick={() => {
                                        this.props.onRead(row.payload);
                                    }}>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                ) : null}
                                {canUpdate ? (
                                    <button className={"btn btn-link btn-sm"} onClick={() => {
                                        this.props.onUpdate(row.payload);
                                    }}>
                                        <FontAwesomeIcon icon={faEdit}/>
                                    </button>
                                ) : null}
                                {canDelete ? (
                                    <button className={"btn btn-link text-danger btn-sm"} onClick={() => {
                                        this.props.onDelete(row.payload);
                                    }}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                ) : null}
                            </div>
                        </td>
                    ) : (<td/>)}
                </tr>
            )
        });
    }

    renderHeader() {
        return $.map(this.props.headers, (header, index) => {
            let icon = null;
            if (this.props.canSort && index === this.state.sortIndex) {
                if (this.state.sortAscending) {
                    icon = <FontAwesomeIcon icon={faSortUp}/>
                } else {
                    icon = <FontAwesomeIcon icon={faSortDown}/>
                }
            }
            return(
                <th className={this.props.canSort ? "hoverable" : ""} key={index} onClick={() => {
                    if (this.props.canSort) {
                        this.setState({
                            sortIndex: index,
                            sortAscending: !this.state.sortAscending
                        })
                    }
                }}>
                    <div className={"row"}>
                        <div className={"col"}>
                            { header }
                        </div>
                        <div className={"col-auto text-primary"}>
                            { icon }
                        </div>
                    </div>
                </th>
            )
        });
    }

    renderFilters(rows) {
        let filterIndexes = [];
        if (_.isArray(this.props.filter)) {
            filterIndexes = this.props.filter;
        }
        return $.map(this.props.headers, (header, index) => {
            if (this.props.filter === true || _.contains(filterIndexes, index)) {
                let options = [];
                rows.forEach((row) => {
                    if (row.cell[index] && row.cell[index].trim() !== "" && !_.contains(options, row.cell[index])) {
                        options.push(row.cell[index]);
                    }
                });
                options.sort((a, b) => {
                    if (a.toLowerCase() === b.toLowerCase()) {
                        return 0;
                    }
                    if (a.toLowerCase() >= b.toLowerCase()) {
                        return 1;
                    }
                    return -1;
                });
                options = $.map(options, (option, index) => {
                    return (
                        <option value={option} key={index}>{ option }</option>
                    )
                });
                return (
                    <td key={index}>
                        <select className={"form-control-sm text-secondary"} value={this.state.filter[index]} onChange={(evt) => {
                            let value = evt.target.value;
                            if (value === "_clear_filter") {
                                value = "";
                            }
                            this.setState({
                                page: 1,
                                filter: {
                                    ...this.state.filter,
                                    [index]: value
                                }
                            })
                        }}>
                            <option value={""} disabled={true} hidden={true}> Filter </option>
                            <option value={"_clear_filter"}> Clear </option>
                            { options }
                        </select>
                    </td>
                );
            } else {
                return <td key={index}/>
            }
        });
    }

    renderPagination(rows) {
        let pageCount = Math.ceil(rows.length / 10) || 1;
        let pagination = [];
        let range = _.range(1, pageCount + 1);
        let haveLess = false;
        let haveMore = false;
        if (pageCount >= 8) {
            let start = this.state.page - 2;
            if (start > 1) {
                haveLess = true;
            } else {
                start = 1;
            }
            let end = start + 5;
            if (end < pageCount) {
                haveMore = true;
            } else {
                end = pageCount;
                start = end - 5;
            }
            range = _.range(start, end);
        }
        if (haveLess) {
            pagination.push(
                <li className={"page-item disabled"} key={0}>
                    <a className={"page-link"} href={"#"} onClick={(evt) => {
                        evt.preventDefault();
                    }}> ... </a>
                </li>
            )
        }
        range.forEach((i) => {
            pagination.push(
                <li className={"page-item" + (this.state.page === i ? " active" : "")} key={i}>
                    <a className={"page-link"} href={"#"} onClick={(evt) => {
                        evt.preventDefault();
                        this.setState({
                            page: i
                        })
                    }}>{ i }</a>
                </li>
            );
        });
        if (haveMore) {
            pagination.push(
                <li className={"page-item disabled"} key={pageCount + 1}>
                    <a className={"page-link"} href={"#"} onClick={(evt) => {
                        evt.preventDefault();
                    }}> ... </a>
                </li>
            )
        }
        return pagination.length > 1 ?  pagination : null;
    }

    render() {
        // At lease 1 page, in case table is empty

        let filtered = this.filterRow(this.props.rows);
        let sorted = this.sortRow(filtered);
        return (
            <div>
                <div className={"my-3 row"}>
                    <h5 className={"col text-secondary"}>
                        { this.props.title }
                    </h5>
                    <div className={"col-auto d-flex align-items-center"}>
                        {
                            this.props.onCreate ? (
                                <button className={"btn btn-primary btn-sm"} onClick={this.props.onCreate}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            ) : null
                        }
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <table className={"table table-hover table-responsive-sm"}>
                            <thead className={"thead-light"}>
                                <tr>
                                    { this.renderHeader() }
                                </tr>
                            </thead>
                            <tbody>
                                { this.props.filter ? <tr >{ this.renderFilters(sorted) }</tr> : null }
                                { this.renderRow(sorted) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                    </div>
                    <div className={"col-auto"}>
                        <nav>
                            <ul className={"pagination"}>
                                { this.renderPagination(sorted) }
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}

CRUDTable.defaultProps = {
    canSort: true
};