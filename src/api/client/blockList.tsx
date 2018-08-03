import Long = require("long")
import * as React from "react"
import update = require("react-addons-update")
import * as ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { BlockLine } from "./blockLine"
import { IBlock, IRest, IMiner } from "./rest"
import { hyconfromString, hycontoString } from "./stringUtil"
import { MinerView } from "./minerView"
import * as moment from "moment"

import { match, Redirect, RouteComponentProps, RouteProps } from "react-router"
import { Button, Dialog, DialogTitle, Grid, Icon, List, ListItem, ListItemText } from "@material-ui/core"
import CardContent from "@material-ui/core/CardContent"
import { Card, CircularProgress } from "material-ui"

const API = 'https://cors-anywhere.herokuapp.com/https://coincodex.com/api/exchange/get_markets_for_coin_summary/HYC/';



interface IBlockListView {
    rest: IRest
    blocks: IBlock[]
}

export class BlockList extends React.Component<any, any> {
    public errMsg1: string = "Please enter a valid Hash value consisting of numbers and English"
    public intervalId: any // NodeJS.Timer
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = { blocks: [], rest: props.rest, length: 0, index: 0, currentPrice: null,updatedAt:null, volume: null, miner:null}
    }
    public componentWillUnmount() {
        this.mounted = false
        window.clearTimeout(this.intervalId)
    }

    public componentDidMount() {
        
        public getHash() {
            
        this.state.rest.getMiner().then((data: IMiner) => {
            this.setState({ miner: data, minerAddress: data.currentMinerAddress, cpuMinerCount: data.cpuCount, hash: data.networkHashRate })
               
    }
  }
                                        
     this.getHash();
                                      
        
        public getData() {      
            
        fetch(API)
      .then(response => response.json())
      .then((data)  => {
            const price = data[0].value;  
            const vol= data[0].volume;
            const updated= data[0].last_update;
            this.setState({
            currentPrice: data[0].value,
                updatedAt: data[0].last_update,
                volume: data[0].volume
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
    }
        this.getData();
         
        this.state.rest.getMiner().then((data: IMiner) => {
      this.setState({ miner: data, minerAddress: data.currentMinerAddress, cpuMinerCount: data.cpuCount, hash: data.networkHashRate })
      this.state.rest.setLoading(false)
        this.intervalId = setInterval(() => {
            this.getRecentBlockList(this.state.index)
            this.getHash()
            this.getData()
            
        }, 15000)
               
      })
            
      
    }
    
    public handleBlockHash(data: any) {
        this.setState({ blockHash: data.target.value })
    }
    public searchBlock(event: any) {
        if (this.state.blockHash === undefined) {
            event.preventDefault()
        } else if (!/^[a-zA-Z0-9]+$/.test(this.state.blockHash)) {
            event.preventDefault()
            if (alert(this.errMsg1)) { window.location.reload() }
        } else {
            this.setState({ redirect: true })
        }
    }

    public getRecentBlockList(index: number) {
        this.state.rest.getBlockList(index).then((result: { blocks: IBlock[], length: number }) => {
            for (const block of result.blocks) {
                let sum = Long.fromInt(0)
                for (const tx of block.txs) {
                    sum = sum.add(hyconfromString(tx.amount))
                }
                block.txSummary = hycontoString(sum)
            }
            this.setState({
                blocks: update(
                    this.state.blocks, {
                        $splice: [[0, this.state.blocks.length]],
                    },
                ),
            })
            this.setState({
                blocks: update(
                    this.state.blocks, {
                        $push: result.blocks,
                    },
                ),
                index: update(
                    this.state.index, {
                        $set: index,
                    },
                ),
                length: update(
                    this.state.length, {
                        $set: result.length,
                    },
                ),
            })
        })
    }

    public render() {
        
        let blockIndex = 0
        if (this.state.blocks.length === 0) {
            return < div ></div >
        }
            if (this.state.redirect) {
                if (this.state.blockHash.length===44){
                    return <Redirect to={`/tx/${this.state.blockHash}`} />
}
            return <Redirect to={`/address/${this.state.blockHash}`} />
        }



        return (
 
              
            <div>
<div className=" donation jss466"><a href="http://htracker.info/address/H3ecJtw8WhPCD4AnoxUbrKZMnvNuq9iX9" className="donatetext jss313 jss319">Donate:H3ecJtw8WhPCD4AnoxUbrKZMnvNuq9iX9</a></div>
<div className="jss256 jss259 jss257 jss468 jss406 jss467">
<div className="jss466"><h1 className="jss313 jss319">Check Wallet Balance/Transaction Status</h1></div>
<div className="jss465"><div className="jss361"><div className="jss369 jss362 jss365">
<label className="jss378 jss373 jss368 jss374 jss377" data-shrink="true" htmlFor="textField-search-field"></label>
<div className="jss383 jss384 jss387">
<input aria-invalid="false" aria-required="false" className="jss391" id="textField-search-field" onChange={(data) => this.handleBlockHash(data)}  placeholder="Enter Address/Transaction Hash" onKeyPress={(event) => { if (event.key === "Enter") { this.searchBlock(event) } }} type="text"/>
</div>
</div>
<button  className="jss310 jss286 jss295 jss296 jss298 jss299 jss363" type="button" onClick={(event) => { this.searchBlock(event) } }> 
<span className="jss287" >
<p className="jss313 jss322 jss364">SEARCH</p>
</span>
<span className="jss337">
</span>
</button>
</div>
</div>
</div>
 



 <div id="data-container">
        { this.state.currentPrice ?
          <div id="left" className='box'>
            <div className="heading">{this.state.currentPrice.toLocaleString('us-EN',{ minimumFractionDigits: 4, style: 'currency', currency: 'USD' })}</div>
            <div className="subtext">{'Updated ' + moment.unix(this.state.updatedAt).fromNow()}</div>
          </div>
        : null}
        { this.state.miner ?
          <div id="middle" className='box'>
            <div className="heading">{this.state.hash.toLocaleString()} kh/s</div>
            <div className="subtext">Network Hash Rate</div>
          </div>
        : null}
        { this.state.volume ?
          <div id="right" className='box'>
            <div className="heading">{this.state.volume.toLocaleString()}</div>
            <div className="subtext">24 Hrs Volume </div>
          </div>
        : null}

      </div>




                <div className="contentTitle">
            <div className="jss1231 jss256 jss259 jss257 jss468 jss406 jss467"><div className="jss466"><h1 className="jss313 jss319">Latest Blocks</h1></div></div>
                </div>

                <div>
                    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined">
                        <thead>
                            <tr>
                                <th className="mdl-data-table__cell--non-numeric">Height</th>
                                <th className="mdl-data-table__cell--non-numeric">Time</th>
                                <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Transactions</th>
                               {/* <th className="mdl-data-table__cell--numeric" style={{ paddingRight: "10%" }}>Total Sent</th> */}
                                <th className="mdl-data-table__cell--non-numeric">Miner Address</th>
                                <th className="mdl-data-table__cell--numeric">Size(kB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.blocks.reverse().map((block: IBlock) => {
                                return <BlockLine key={blockIndex++} block={block} />
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    private handlePageClick = (data: any) => {
        this.getRecentBlockList(data.selected)
    }
}
