import React from 'react';
import ReactDOM from 'react-dom';

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "匿名用户",
            msg: "",
            log: [],
            logNode:[],
        };
    }

    componentDidMount = () => {
        this.props.conn.onmessage = (msg) => {
            this.addLog("remote", msg.data);
        };
    }


    sendMsg = () => {
        const msg = this.state.msg;
        this.addLog("local",msg);
        this.props.conn.send(this.state.name + ":" + msg);
    }

    refreshMsg = () => {
        this.setState({
            msg: ReactDOM.findDOMNode(this.refs["text"]).value,
        });
    }

    changeName = () => {
        this.setState({
            name: ReactDOM.findDOMNode(this.refs["name"]).value,
        });
    }

    addLog = (usr, msg) => {
        const log = usr + ":"+msg;
        this.state.log.push(log);
        this.state.logNode.push(<LogItem msg={log}></LogItem>);
        console.log("push!");
        this.forceUpdate();
    }

    render = () => {
        return (
            <div className = "ChatBox" >
                <input ref = "name" type="text" onChange = {this.changeName}/>
                <div ref = "log" style = {{width:300,height:500,color:"black",overflow:"auto"}} >
                    {this.state.logNode}
                </div>
                <input ref = "text" type="text" onChange = {this.refreshMsg}/>
                <button ref = "send" onClick = {this.sendMsg}>send</button>
            </div>
        )
    }
}

class LogItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: "",
        };
    }

    render = () => {
        return (<div className = "LogItem">
            {this.props.msg}
        </div>)
    }
}