import React from "react";
import $ from "jquery";
import API from "../share/API";
import {Fade} from "react-bootstrap";
import URI from "urijs";
import { Link } from "react-router-dom"
export default class MemberApp extends React.Component{
    state = {
        formData: {
            testQuery: "",
        },
        queryResult: []
    };

    async handleFormSubmit(evt) {
        try {
            evt.preventDefault();
            const url = URI(API.member.exams()).setQuery({
                q: this.state.formData.testQuery
            }).toString();
            const res = await $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + this.props.token.accessToken
                }
            });
            this.setState({
                queryResult: res
            })
        } catch (e) {
            console.error(e)
        }
    }

    handleFormChange(evt) {
        let copy = {
            ...this.state.formData,
            [evt.target.name]: [evt.target.value]
        };
        this.setState({
            formData: copy
        })
    }

    render() {
        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div>
                        Hello World from MemberApp
                    </div>
                </div>
            </div>
        );
    }

}