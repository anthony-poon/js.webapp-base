import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component{

    render() {
        return (
            <nav className={"navbar navbar-expand-md navbar-light bg-light"}>
                <button className={"btn btn-link text-secondary d-block d-md-none"} onClick={this.props.onMenuToggle}>
                    <FontAwesomeIcon icon={faBars} data={{
                        toggle: "collapse"
                    }}/>
                </button>
                <Link className="navbar-brand ml-auto flex-grow-1" to="/">
                    {/*<img className={"img-fluid"} src={"/images/nav_logo.png"} alt={"logo"}/>*/}
                    <span className={"ml-3"}>ISTO</span>
                </Link>
                {
                    !this.props.token
                        ? (
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <Link className="nav-link text-primary" to={"/login"}>Login</Link>
                                </li>
                            </ul>
                        )
                        : (
                            <div className={"navbar-text mx-3"}>
                                { this.props.token.name }
                            </div>
                        )
                }
            </nav>
        );
    }

}