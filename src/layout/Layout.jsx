import React from "react"
import Navbar from "./navbar/Navbar";
import "./layout.scss";
import Menu from "./menu/Menu";

export default class Layout extends React.Component{
    state = {
        isMenuVisible: false
    };
    render() {
        return (
            <div className={"row no-gutters"}>
                <div className={"col-auto show-md" + (this.state.isMenuVisible ? "" : " collapse")}>
                    <Menu
                        token={this.props.token}
                        onClose={() => {
                            this.setState({
                                isMenuVisible: false
                            })
                        }}
                        onLogout={this.props.onLogout}
                    />
                </div>
                <div className={"col"}>
                    <div>
                        <Navbar token={ this.props.token } onMenuToggle={() => {this.setState({
                            isMenuVisible: !this.state.isMenuVisible
                        })}}/>
                    </div>
                    <div className={"py-5 px-3"}>
                        { this.props.children }
                    </div>
                </div>
            </div>



        );
    }

}