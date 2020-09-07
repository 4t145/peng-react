import React from 'react';
import './App.css';
import ColorPicker from './components/ColorPicker/ColorPicker.jsx';
import DrawPad from './components/DrawPad/DrawPad.jsx';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color:"ff0000"
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

    render = () => {
        return (
            <div className="App" onChange = {this.handleOnChange}>
                <header className="App-header">
                    <ColorPicker ref = "colorPicker"></ColorPicker>
                    <DrawPad color = {this.state.color}/>
                </header>
            </div>
        )
    };
}

export default App; 
