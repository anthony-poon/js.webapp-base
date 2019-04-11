import React from "react"
import $ from "jquery";
import API from "../share/API";
import anime from "animejs";
export default class LoginApp extends React.Component{
    state = {
        email: "",
        password: "",
        confirmPassword: "",
        formError: null,
        isLogin: true,
        isTrigger: true,
    };

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    componentDidMount() {
        this.fadeIn = anime({
            targets: ".fade-in",
            opacity: 1,
            duration: 3000
        });
    }

    async handleSubmit(evt) {
        try {
            evt.preventDefault();
            if (this.state.isLogin) {
                // TODO: Check form error
                this.setState({
                    formError: null
                });
                let res = await $.ajax(API.login(), {
                    method: "POST",
                    data: {
                        email: this.state.email,
                        password: this.state.password
                    }
                });
                this.props.onLogin(res);
            } else {
                // Handle Register
                // TODO: Check form error
                this.setState({
                    formError: null
                });
                await $.ajax(API.register(), {
                    method: "POST",
                    data: {
                        email: this.state.email,
                        password: this.state.password
                    }
                });
                let res = await $.ajax(API.login(), {
                    method: "POST",
                    data: {
                        email: this.state.email,
                        password: this.state.password
                    }
                });
                this.props.onLogin(res);
            }
        } catch (e) {
            console.error(e);
            switch (true) {
                case (e.status === 404 || e.status >= 500):
                    this.setState({
                        formError: "Server Error - " + e.status
                    });
                    break;
                case (e.status >= 400):
                    this.setState({
                        formError: "Invalid email or password."
                    });
                    break;
                default:
                    this.setState({
                        formError: "Unknown error."
                    });
                    break;
            }
        }
    }

    renderSignInForm() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} className={"fade-in"} style={{
                opacity: 0
            }}>
                <h5 className={"text-info text-center mb-3"}>
                    Login
                </h5>
                <div className={"text-secondary text-center"}>
                    <small>or</small>
                </div>
                <div className={"text-secondary text-center mt-3 mb-5"}>
                    <button type={"button"} className={"btn btn-link text-info"} onClick={() => {
                        this.setState({
                            isLogin: false,
                        });
                        this.fadeIn.restart();
                    }}>Register an account now!</button>
                </div>
                {
                    this.state.formError !== null
                        ? <div className={"alert alert-danger"} role="alert">Error: { this.state.formError }</div>
                        : null
                }
                <div className={"form-group row"}>
                    <div className={"col-12 col-md-3"}>
                        <label>Email</label>
                    </div>
                    <div className={"col"}>
                        <input type={"email"} className={"form-control"} name={"email"} value={this.state.email} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
                <div className={"form-group row"}>
                    <div className={"col-12 col-md-3"}>
                        <label>Password</label>
                    </div>
                    <div className={"col"}>
                        <input type={"password"} className={"form-control"} name={"password"} value={this.state.password} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
                <div className={"form-group row mt-5"}>
                    <div className={"col"}>
                        <input type={"submit"} className={"btn btn-primary btn-block btn-sm"} value={"Submit"}/>
                    </div>
                </div>
            </form>

        );
    }

    renderRegisterForm() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)} style={{
                opacity: 0
            }}>
                <h5 className={"text-info text-center mb-3"}>
                    Register
                </h5>
                <div className={"text-secondary text-center"}>
                    <small>or</small>
                </div>
                <div className={"text-center mt-3 mb-5"}>
                    <button type={"button"} className={"btn btn-link text-info"} onClick={() => {
                        this.setState({
                            isLogin: true,
                        });
                        this.fadeIn.restart();
                    }}>Login into your account now!</button>
                </div>
                {
                    this.state.formError !== null
                        ? <div className={"alert alert-danger"} role="alert">Error: { this.state.formError }</div>
                        : null
                }
                <div className={"form-group row"}>
                    <div className={"col-12 col-md-3"}>
                        <label>Email</label>
                    </div>
                    <div className={"col"}>
                        <input type={"email"} className={"form-control"} name={"email"} value={this.state.email} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
                <div className={"form-group row"}>
                    <div className={"col-12 col-md-3"}>
                        <label>Password</label>
                    </div>
                    <div className={"col"}>
                        <input type={"password"} className={"form-control"} name={"password"} value={this.state.password} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
                <div className={"form-group row"}>
                    <div className={"col-12 col-md-3"}>
                        <label>Confirm Password</label>
                    </div>
                    <div className={"col"}>
                        <input type={"password"} className={"form-control"} name={"confirmPassword"} value={this.state.confirmPassword} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
                <div className={"form-group row mt-5"}>
                    <div className={"col"}>
                        <input type={"submit"} className={"btn btn-primary btn-block btn-sm"} value={"Submit"}/>
                    </div>
                </div>
            </form>

        );
    }

    render() {
        return (
            <div className={"row pt-5"}>
                <div className={"col-12 col-md-8 col-lg-6 m-auto"}>
                    { this.state.isLogin ? this.renderSignInForm() : this.renderRegisterForm() }
                </div>
            </div>

        );
    }
}