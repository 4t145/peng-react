import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './DrawPad.css'
export default class DrawPad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawing: false,
            // path: [],
            // cmd_buf: [],
            cmds:[],
            cmds_redo: [],
            cmd_unsaved: {
                buf:[],
            },
        };
        this.canvas = React.createRef();
    }

    // drawline = (x0,y0,x1,y1) => {
    //     const cvs = ReactDOM.findDOMNode(this.refs["canvas"]);
    //     const ctx = cvs.getContext("2d");
        
    //     ctx.lineTo(x1,y1);
    // }

    componentDidMount = () => {
        const cvs = this.canvas.current;
        cvs.width = 800;
        cvs.height = 600;
        setInterval(this.draw, 1000/60);
    }   
    
    drawCmd = (ctx, cmd) => {
        if (cmd.buf.length > 1) {
            const p = cmd.buf[0];
            // ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = cmd.color;
            ctx.lineWidth = cmd.size;
            ctx.moveTo(p.x,p.y);
            for (let index = 1; index < cmd.buf.length; index++) {
                const p = cmd.buf[index];
                ctx.lineTo(p.x,p.y);
            }
            ctx.stroke();
            // ctx.restore();
        }

        if (cmd.buf.length === 1) {
            ctx.beginPath();
            ctx.fillStyle = cmd.color;
            const p = cmd.buf[0];
            ctx.arc(p.x,p.y,cmd.size/2,0,2*Math.PI);        
            ctx.fill();
        }
    };

    drawAll  = () => {
        const cvs = this.canvas.current;
        if(cvs) {
            const ctx = cvs.getContext("2d");
            this.state.cmds.forEach(cmd => {
                this.drawCmd(ctx, cmd);
            });
        }
    };

    drawUnsaved = () => {
        const cvs = this.canvas.current;
        const ctx = cvs.getContext("2d");
        this.drawCmd(ctx, this.state.cmd_unsaved);
    };

    clearAll = () => {
        const cvs = this.canvas.current;
        const ctx = cvs.getContext("2d");
        ctx.clearRect(0,0,800,600)
    }
    draw = () => {
        this.clearAll();
        this.drawAll();
        this.drawUnsaved();
    }

    handleOnMouseDown = (e) => {
        const rect = this.canvas.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.setState((state) => {
            state.cmd_unsaved = {
                buf:[{x:x,y:y}],
                color: "#" + this.props.color,
                size: 5,
            };
            state.drawing = true;
        });
    }

    handleOnMouseMove = (e) => {
        if (this.state.drawing) {
            const rect = this.canvas.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.setState((state) => {
                state.cmd_unsaved.buf.push({x:x,y:y});
            });
        }
    }

    handleOnMouseUp = () => {
        console.log("mouseUp 调用")
        this.setState((state) => {
            state.cmds_redo = [];
            state.cmds.push(state.cmd_unsaved);
            state.cmd_unsaved = {
                buf:[],
            }
            state.drawing = false;
        });
    }

    handleOnKeyUp = (e) => {
        // console.log(e.keyCode);
        if (this.state.drawing) {
            return;
        }

        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 90: {
                    this.setState((state) => {
                        const undo = state.cmds.pop();
                        if(undo){
                            state.cmds_redo.push(undo);
                        }
                    });
                    break;
                }
                case 89: {
                    this.setState((state) => {
                        const redo = state.cmds_redo.pop();
                        if(redo){
                            state.cmds.push(redo);
                        }
                    });
                    break;
                }
                default:
                    break;
            }
        }
    }

    render = () => {
        return (
            <div className = "DrawPad" >
                <canvas 
                ref = {this.canvas}
                onMouseDown = {this.handleOnMouseDown} 
                onMouseMove = {this.handleOnMouseMove}
                onMouseUp = {this.handleOnMouseUp}
                // onClick = {this.handleOnClick}
                onKeyUp = {this.handleOnKeyUp}
                tabIndex="0"
                >

                </canvas>
            </div>
        )
    }
}
