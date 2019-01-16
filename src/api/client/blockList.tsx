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
import { TxPoolLine } from "./txPoolLine"
import { TxLine } from "./txLine"
import { ITxProp } from "./rest"

import { match, Redirect, RouteComponentProps, RouteProps } from "react-router"
import { Button, Dialog, DialogTitle, Grid, Icon, List, ListItem, ListItemText } from "@material-ui/core"
import CardContent from "@material-ui/core/CardContent"
import { Card, CircularProgress } from "material-ui"

const API = 'https://api.coinmarketcap.com/v2/ticker/3147/';
const SUPPLY = 'https://api.hycon.io/api/v2/supply';
const RANK= 'https://api.coingecko.com/api/v3/coins/hycon';

interface ITxListView {
    rest: IRest
    txs: ITxProp[]
}


interface IBlockListView {
    rest: IRest
    blocks: IBlock[]
}

export class BlockList extends React.Component<any, any> {
    public txs: ITxProp[]
    public errMsg1: string = "Please enter a valid Hash value consisting of numbers and English"
    public intervalId: any // NodeJS.Timer
    public mounted: boolean = false
    constructor(props: any) {
        super(props)
        this.state = {txs: [], rest: props.rest, length: 0,  totalCount: 0, totalFee: "0", totalAmount: "0" ,blocks: [],  index: 0, currentPrice: null,updatedAt:null, volume: null, miner:null, height:0, localheight: null, index1: 0,currentMcap:null,currentRank:null,currentTime:null}
    }
    
     
    
    public componentWillUnmount() {
        this.mounted = false
        window.clearTimeout(this.intervalId)
        
    }

    public componentDidMount() {
     
        
       
        this.mounted = true
        this.getRecentBlockList1(this.state.index)
        this.getPendingTxs(this.state.index1)
        this.getHash()                                  
        this.getData()
        this.getSupply()
        this.getRank()
        this.getTime()
        this.getRemoteHeight()
        this.getLocalHeight()
       
       
        this.state.rest.getMiner().then((data: IMiner) => {
     this.setState({ miner: data, minerAddress: data.currentMinerAddress, cpuMinerCount: data.cpuCount, hash: data.networkHashRate })
      this.state.rest.setLoading(false)
            
            this.intervalId = setInterval(() => {
                
                const script = document.createElement("script");

            script.src = "https://files.coinmarketcap.com/static/widget/currency.js";
            script.type = 'text/javascript';
            script.async = true;

             document.body.appendChild(script);
                
                }, 500)
      
            
                    this.intervalId = setInterval(() => {
                        this.getRemoteHeight()
                        this.getLocalHeight()
                       
                        
                        if (parseInt(this.state.remoteheight)>parseInt(this.state.localheight)){
                            
                            this.getRecentBlockList1(this.state.index)
                            
                           
                        }
                        else{
                            
                            this.getRecentBlockList1(this.state.index)
                            
                            
                        }
            
            this.getPendingTxs(this.state.index1)            
            this.getHash()
            this.getData()
            this.getRank()
            this.getTime()
            this.getSupply()
        }, 7000)
      })
    
    }
    
   
     public getRemoteTxs(index: number): Promise<{ txs: ITxProp[], length: number, totalCount: number, totalAmount: string, totalFee: string }> {
        return Promise.resolve(
            fetch('http://hplorer.com:2441/api/v1/txList/0')
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
    
    
    
    public getPendingTxs(index1: number) {
       this.state.rest.setLoading(true)
       this.getRemoteTxs(index1).then((result: { txs: ITxProp[], length: number, totalCount: number, totalAmount: string, totalFee: string }) => {
            this.setState({
                txs: update(this.state.txs, { $splice: [[0, this.state.txs.length]] }),
            })
            this.setState({
                index1: update(this.state.index1, { $set: index1 }),
                length: update(this.state.length, { $set: result.length }),
                totalAmount: update(this.state.totalAmount, { $set: result.totalAmount }),
                totalCount: update(this.state.totalCount, { $set: result.totalCount }),
                totalFee: update(this.state.totalFee, { $set: result.totalFee }),
                txs: update(this.state.txs, { $push: result.txs }),
            })
            this.state.rest.setLoading(false)
        })
    }
    
     
    
    
    public getRemoteHeight(){
    
         fetch('http://hplorer.com:2441/api/v1/topTipHeight')
      .then(response => response.json())
      .then((data)  => {
            const tipheight = data.height; 
             
            this.setState({
            remoteheight: data.height              
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
        
        
    }
    
    
    public getLocalHeight(){
    
         fetch('https://api.hycon.io/api/v2/topTipHeight')
      .then(response => response.json())
      .then((data)  => {
            const tipheight1 = data.height; 
             
            this.setState({
            localheight: data.height              
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
        
        
    }
    
    
    public getRemoteBlocks(index: number): Promise<{ blocks: IBlock[], length: number }> {
        return Promise.resolve(
            fetch('http://hplorer.com:2441/api/v1/blocklist/0')
                .then((response) => response.json())
                .catch((err: Error) => {
                    console.log(err)
                }),
        )
    }
     
    
    public getHash() {
            
        fetch('http://hplorer.com:2441/api/v1/getMiner')
      .then(response => response.json())
      .then((data)  => {
            const hash1 = data.networkHashRate; 
             
            this.setState({
            hash: data.networkHashRate              
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
        
  }
    
    public getData() {      
            
        fetch(API)
      .then(response => response.json())
      .then((data)  => {
            const price = data.data.quotes.USD.price;  
            const vol= data.data.quotes.USD.volume_24h;
            const updated= data.data.last_updated;
            this.setState({
            currentPrice: data.data.quotes.USD.price,
                updatedAt: data.data.last_updated,
                volume:data.data.quotes.USD.volume_24h
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
    }
    
     public getRank() {      
            
        fetch(RANK)
      .then(response => response.json())
      .then((data)  => {
            const rank = data.market_cap_rank;  
            const mcap= data.market_data.market_cap.usd;
            this.setState({
            currentRank: data.market_cap_rank,
            currentMcap: data.market_data.market_cap.usd
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
    }
    
    public getTime() {      
            
        fetch('http://hplorer.com:2441/api/v1/blocklist/0')
      .then(response => response.json())
      .then((data)  => {
            const block0 = data.blocks[0].timeStamp;  
            const block19 = data.blocks[19].timeStamp;
            this.setState({
            currentTime: (block19-block0)/20000,
           
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
    }
    
    
    
    
   
     public getSupply() {      
            
        fetch(SUPPLY)
      .then(response => response.json())
      .then((data)  => {
            const totalS = data.totalSupply;  
            const circS= data.circulatingSupply;
           
            this.setState({
            Tsupply: Math.round((data.totalSupply/1000000000)*100)/100,
                Csupply: Math.round((data.circulatingSupply/1000000000)*100)/100
                
                    })
                       })
         .catch((e) => {
          console.log(e);
        });
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
    
    public getRecentBlockList1(index: number) {
        this.getRemoteBlocks(index).then((result: { blocks: IBlock[], length: number }) => {
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
        let txIndex = 0
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
 
<div className="coinmarketcap-currency-widget" data-currencyid="3147" data-base="USD" data-secondary="BTC" data-ticker="true" data-rank="true" data-marketcap="true" data-volume="true" data-stats="USD" data-statsticker="false"></div>

 <div id="data-container">

        { this.state.currentPrice ?
          <div id="left" className='box'>
            <div className="heading">{this.state.currentPrice.toLocaleString('us-EN',{ minimumFractionDigits: 4, style: 'currency', currency: 'USD' })}</div>
            <div className="subtext">{'Updated ' + moment.unix(this.state.updatedAt).fromNow()}</div>
          </div>
        : <div id="left" className='box'>
            <div className="heading">Fetching...</div>
            <div className="subtext">HYC Price</div>
          </div>}
        { this.state.miner ?
          <div id="middle" className='box'>
            <div className="heading">{this.state.hash.toLocaleString()}</div>
            <div className="subtext">Network Hash Rate</div>
          </div>
        : null}
        { this.state.volume ?
          <div id="right" className='box'>
            <div className="heading">{this.state.volume.toLocaleString()}</div>
            <div className="subtext">24 Hrs Volume </div>
          </div>
        : <div id="right" className='box'>
            <div className="heading">Fetching...</div>
            <div className="subtext">24 Hrs Volume </div>
          </div>}
{ this.state.Tsupply ?
          <div id="right" className='box'>
            <div className="heading">{this.state.Csupply.toLocaleString()}B/{this.state.Tsupply.toLocaleString()}B</div>
            <div className="subtext">Circulating/Total Supply</div>
          </div>
        : <div id="right" className='box'>
            <div className="heading">Fetching...</div>
            <div className="subtext">Circulating/Total Supply</div>
          </div>}




      </div>

 <div id="data-container">
        { this.state.currentRank ?
          <div id="left" className='box'>
            <div className="heading">{this.state.currentRank.toLocaleString()}</div>
            <div className="subtext">Rank by MarketCap</div>
          </div>
        : <div id="left" className='box'>
            <div className="heading">Loading...</div>
            <div className="subtext">Rank by MarketCap</div>
          </div>}
        
        { this.state.currentMcap ?
          <div id="middle" className='box'>
            <div className="heading">{this.state.currentMcap.toLocaleString('us-EN',{style: 'currency', currency: 'USD' })}</div>
            <div className="subtext">MarketCap in USD</div>
          </div>
        : <div id="middle" className='box'>
            <div className="heading">Loading...</div>
            <div className="subtext">MarketCap in USD</div>
          </div>}

{ this.state.currentTime ?
          <div id="right" className='box'>
            <div className="heading">{this.state.currentTime.toLocaleString()}s</div>
            <div className="subtext">Average BlockTime</div>
          </div>
        : <div id="right" className='box'>
            <div className="heading">Fetching...</div>
            <div className="subtext">Average BlockTime</div>
          </div>}

      </div>

<div className="maindata">
<div className="blocks">

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
{ this.state.txs ?
                        <tbody>
                            {this.state.blocks.reverse().map((block: IBlock) => {
                                return <BlockLine key={blockIndex++} block={block} />
                            })}
                        </tbody>
:                        <tbody>
                          <th className="mdl-data-table__cell--non-numeric"> No Pending Transactions </th>
                        </tbody>}

                    </table>
                </div>
</div>

<div className="txn">
  <div className="contentTitle">
            <div className="jss1231 jss256 jss259 jss257 jss468 jss406 jss467"><div className="jss466"><h1 className="jss313 jss319">Pending Transactions</h1></div></div>
                </div>

                <div>
                    <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp table_margined">
                        <thead>
                            <tr>
                                    <th className="mdl-data-table__cell--non-numeric">Hash</th>
                                    <th className="mdl-data-table__cell--non-numeric">From</th>
                                    <th className="mdl-data-table__cell--non-numeric">To</th>
                                    <th className="mdl-data-table__cell--non-numeric">Amount</th>
                     
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.txs.map((tx: ITxProp) => {
                                return <TxPoolLine key={txIndex++} tx={tx} />
                            })}
                        </tbody>
                    </table>
                </div>
</div>
</div>



<div className=" donation jss466"><a href="http://htracker.info/address/H3ecJtw8WhPCD4AnoxUbrKZMnvNuq9iX9" className="donatetext jss313 jss319">Donate:H3ecJtw8WhPCD4AnoxUbrKZMnvNuq9iX9</a></div>
            </div>
        )
    }

    private handlePageClick = (data: any) => {
        this.getRecentBlockList(data.selected)
    }
}
