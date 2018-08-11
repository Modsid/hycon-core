import React, {Component} from "react";
import ReactTable from 'react-table'

import {Link} from "react-router-dom"

class TransactionTable extends Component {
  constructor(props){
    super(props)
    this.state = {
      page : 0
    }   
  }

  render() {
    var columns = []
    if(this.props.hasBlock)
    {
      columns = [     {
        Header: 'Block',
        accessor: 'block',
        width : 75
      }
  ]
    }
    else if(this.props.hasTime) {
      columns = [     {
        Header: 'Time',
        id: 'timestamp',
        accessor: d => d.tx.time !== undefined ? new Date(d.tx.time).toUTCString()
        .split(',')[1].replace("201","1") : "Pending",
        width : 200
      }
    ]
    }
  
    columns = columns.concat([
    
  {
    Header : 'Hash',
    minWidth : 50,
    accessor : 'tx.hash',
    Cell : row => <Link to={`/tx/${row.value}`}>{row.value}</Link>
  },
    {
        Header : 'Amount',
        accessor : 'tx.amount',
        maxWidth : 250,
        getProps: (state, rowInfo, column) => {
          return {
            style: {
              backgroundColor: ( this.props.address && rowInfo && column ) ? ( rowInfo.original.tx.to == this.props.address ? "#4bbca3" : "#e0889b" ) : null,
            }
          }
        }
    },
  ])

  return (
    <ReactTable 
    page = {this.state.page}
    onPageChange={(pageIndex) => this.setState({ page : pageIndex})   }// Called when the page index is changed by the user
    className='-striped'
    data ={this.props.txs}
    columns = {columns}
      //showPagination = {props.showPagination}
      defaultPageSize = {20}
      minRows = {2}
      showPageSizeOptions = {false}
    defaultSorted = { this.props.hasBlock ? [
      {
        id: "block",
        desc: true
      }
    ] : []}
  />
  );
  }
}

export default TransactionTable


// WEBPACK FOOTER //
// src/components/TransactionTable.js
