import React from 'react';
import './App.css';
import ColorPicker from './components/ColorPicker/ColorPicker.jsx';
import DrawPad from './components/DrawPad/DrawPad.jsx';
import ChatBox from './components/ChatBox/ChatBox.jsx';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color:"ff0000",
            conn:new WebSocket('ws://localhost:8201/ws/')
        };
        this.colorPicker = React.createRef();
    }

    getColor = () => {
        this.setState({
            color: this.refs['colorPicker'].state.color,
        })
    }

    handleOnChange = () => {
        this.getColor();
    }
    
    sayHello = () => {
        this.state.conn.onopen = () => {
            this.state.conn.send("test");
            this.state.conn.send("hello!");
        }
    }

    render = () => {
        this.sayHello();
        return (
            <div className="App" onChange = {this.handleOnChange}>
                <header className="App-header">
                    <ColorPicker ref = "colorPicker"></ColorPicker>
                    <DrawPad color = {this.state.color}/>
                    <ChatBox conn = {this.state.conn} />
                </header>
            </div>
        )
    };
}

export default App; 
