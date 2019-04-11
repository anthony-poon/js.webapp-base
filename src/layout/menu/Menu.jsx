import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./menu.scss";
import {NavLink} from "react-router-dom";

export default class Menu extends React.Component {
    items = [
        {
            "text": "Home",
            "url": "/",
        }, {
            "text": "User Management",
            "url": "/admin/users",
            "role": "ROLE_ADMIN"
        }, {
            "text": "Link 1",
            "url": "/member"
        }, {
            "text": "Link 2",
            "url": "/member/2"
        }, {
            "text": "Link 3",
            "url": "/member/3"
        }, {
            "text": "Link 4",
            "url": "/member/4"
        }
    ];
    render() {
        return (
            this.props.token !== null
                ? (
                    <div className={"layout-menu__container"}>
                        <div className={"layout-menu__header"}>
                            <div className={"text-right d-block d-md-none"}>
                                <button className={"btn btn-link mr-3 text-white"} onClick={this.props.onClose}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </button>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUserCircle}/> <span className={"ml-3"}> Menu </span>
                            </div>
                        </div>
                        <div className={"layout-menu__body"}>
                            {
                                this.items.map((val, index) => {
                                    if (!val.role || (this.props.token && this.props.token.role === val.role)) {
                                        return (
                                            <NavLink exact to={val.url} className={"layout-menu__item px-4 py-2"} key={index}>
                                                { val.text }
                                            </NavLink>
                                        )
                                    }
                                    return null;
                                })
                            }
                        </div>
                        <div className={"layout-menu__footer pb-5"}>
                            <div className={"layout-menu__item px-4 py-2"} onClick={this.props.onLogout}>
                                Sign Out
                            </div>
                        </div>
                    </div>
                ) : null
        );
    }
}