import Long = require("long")
import * as React from "react"
import update = require("react-addons-update")
import * as ReactPaginate from "react-paginate"
import { Link } from "react-router-dom"
import { BlockLine } from "./blockLine"
import { IBlock, IRest, IMiner } from "./rest"
import { hyconfromString, hycontoString } from "./stringUtil"
import { MinerView } from "./minerView"

import { match, Redirect, RouteComponentProps, RouteProps } from "react-router"
import { Button, Dialog, DialogTitle, Grid, Icon, List, ListItem, ListItemText } from "@material-ui/core"
import CardContent from "@material-ui/core/CardContent"
import { Card, CircularProgress } from "material-ui"

const API = 'https://www.okex.com/api/v1/ticker.do?symbol=';
const HYC = 'hyc_btc';
const BTC = 'btc_usdt';



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
        this.state = { blocks: [], rest: props.rest, length: 0, index: 0, price_hyc: [], price_btc: [] }
    }
    public componentWillUnmount() {
        this.mounted = false
        window.clearTimeout(this.intervalId)
    }

    public componentDidMount() {
        
        fetch(API + HYC)
      .then(response => response.json())
      .then(data => this.setState({ price_hyc: data.price_hyc }));
        
      fetch(API + BTC)
      .then(response => response.json())
      .then(data => this.setState({ price_btc: data.price_btc }));  
        
        
        
        this.getRecentBlockList(this.state.index)
        this.state.rest.getMiner().then((data: IMiner) => {
            this.setState({ miner: data, minerAddress: data.currentMinerAddress, cpuMinerCount: data.cpuCount })
      this.state.rest.setLoading(false) 
        this.intervalId = setInterval(() => {
            this.getRecentBlockList(this.state.index)
            this.state.rest.getMiner()
            
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
        const { price_hyc } = this.state;
        const { price_btc } = this.state;
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
 if (this.state.miner === undefined) {
            return <div></div>
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
   <div className="jss256 jss259 jss257 jss468 jss406 jss467"><div className="jss466"><h1 className="jss313 jss319">Network Hash Rate</h1></div><div className="jss465"><div className="jss361"><div className="jss369 jss362 jss365"><span className="jss3781"> {this.state.miner.networkHashRate.toLocaleString()} KH/s</span></div></div></div></div>


   <div className="jss256 jss259 jss257 jss468 jss406 jss467"><div className="jss466"><h1 className="jss313 jss319">Latest Price</h1></div><div className="jss465"><div className="jss361"><div className="jss369 jss362 jss365"><span className="jss3781"> {price_hyc.map((price) => <div> <span> {price.ticker.last}</span> Sats </div>)} </span></div></div></div></div>

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
