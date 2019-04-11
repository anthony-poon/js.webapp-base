import React, {Component} from 'react';
import {Router, Route, Redirect, Switch} from "react-router-dom";
import IndexApp from "./index/IndexApp.jsx"
import MemberApp from "./member/MemberApp";
import LoginApp from "./index/LoginApp";
import { createBrowserHistory } from "history";
import Layout from "./layout/Layout";
import UserAdminApp from "./admin/UserAdminApp";
import URI from "urijs"
import Cookie from "js-cookie";
const PrivateRoute = ({ component: Component, token, userRole, ...rest }) => {
    let redirection = rest.path;
    let status = 200;
    if (token === null) {
        status = 401;
    } else if (userRole && userRole !== token.role) {
        status = 403;
    }
    return (
        <Route
            { ... rest}
            render={(props) => (
                status === 200
                    ? <Component {... props} token={token}/>
                    : <Redirect to={{
                        pathname: "/login",
                        search: URI.buildQuery({
                            r: redirection,
                            s: status
                        })
                    }} />
            )}
        />
    )
};

class App extends Component {
    constructor(props) {
        super(props);
        this.history = createBrowserHistory();
        const token = Cookie.get("token");
        const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
        if (payload) {
            this.state = {
                token: {
                    id: payload.id,
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                    accessToken: token
                }
            };
        } else {
            this.state = {
                token: null
            };
        }
    }

    render() {
        return (
            <Router history={this.history}>
                <Layout
                    token={this.state.token}
                    onLogout={() => {
                        this.setState({
                            token: null
                        })
                    }}
                >
                    <Switch>
                        <Route path={"/"} exact component={IndexApp}/>
                        <Route path={"/login"} exact component={
                            (props) => (
                                <LoginApp
                                    { ... props }
                                    onLogin={(token) => {
                                        Cookie.set("token", token);

                                        const payload = JSON.parse(atob(token.split(".")[1]));
                                        this.setState({
                                            token: {
                                                id: payload.id,
                                                name: payload.name,
                                                email: payload.email,
                                                role: payload.role,
                                                accessToken: token
                                            }
                                        });

                                        const query = URI.parseQuery(props.location.search);
                                        // Default path if no redirection set and is logged in
                                        let redirection = query.r;
                                        if (!redirection) {
                                            redirection = (token.role === "ROLE_ADMIN" ? "/admin" : "/member");
                                        }
                                        this.history.push(redirection);
                                    }}
                                />
                            )
                        }/>
                        <PrivateRoute token={this.state.token} exact path={"/admin/users"} userRole={"ROLE_ADMIN"} component={UserAdminApp}/>
                        <PrivateRoute token={this.state.token} path={"/member*"} component={MemberApp}/>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}


export default App;
