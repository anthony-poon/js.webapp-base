import React from "react";
import $ from "jquery";
import API from "../share/API.js";
import CRUDTable from "../share/crud-table/CRUDTable";
import ReactModal from "../share/react-modal/ReactModal";
export default class UserAdminApp extends React.Component {
    state = {
        tableData: [],
        isModalVisible: false,
        formData: {
            id: null,
            fullName: "",
            isAdmin: false,
            email: "",
            password: "",
            passwordConfirm: ""
        }
    };

    componentDidMount() {
        this.ajaxGet();
    }

    async ajaxGet() {
        try {
            const res = await $.ajax({
                url: API.admin.users(),
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + this.props.token.accessToken
                }
            });
            const tableData = res.map((val, index) => {
                return {
                    cell: [
                        val.id,
                        val.fullName,
                        val.role,
                        val.email
                    ],
                    payload: val,
                }
            });
            this.setState({
                tableData: tableData
            })
        } catch (e) {
            console.error(e);
        }
    }

    handleFormChange(evt) {
        const copy = {
            ...this.state.formData,
            [evt.target.name]: evt.target.value
        };
        this.setState({
            formData: copy
        });
    }

    async handleFormSubmit(evt) {
        try {
            evt.preventDefault();
            // TODO: Form Check
            if (!this.state.formData.id) {
                // Create
                const res = await $.ajax({
                    url: API.admin.users(),
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + this.props.token.accessToken
                    },
                    data: {
                        fullName: this.state.formData.fullName,
                        email: this.state.formData.email,
                        password: this.state.formData.password,
                        role: "ROLE_USER"
                    }
                });
            } else {
                // Update
                const res = await $.ajax({
                    url: API.admin.users() + "/" + this.state.formData.id,
                    method: "PATCH",
                    headers: {
                        "Authorization": "Bearer " + this.props.token.accessToken
                    },
                    data: {
                        fullName: this.state.formData.fullName,
                        email: this.state.formData.email,
                        password: this.state.formData.password,
                        role: "ROLE_USER"
                    }
                });
            }
            this.setState({
                isModalVisible: false
            });
            await this.ajaxGet();
        } catch (e) {
            console.error(e)
        }
    }

    async handleItemDelete(payload) {
        try {
            const res = await $.ajax({
                url: API.admin.users() + "/" + payload.id,
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + this.props.token.accessToken
                }
            });
            this.setState({
                isModalVisible: false
            });
            await this.ajaxGet();
        } catch (e) {
            console.error(e)
        }
    }

    renderModal() {
        return (
            <ReactModal
                title={"Create / Edit User"}
            >
                <div className={"px-3 py-5"}>
                    <form onSubmit={this.handleFormSubmit.bind(this)}>
                        <div className={"form-group"}>
                            <label>Full Name</label>
                            <input
                                className={"form-control"}
                                type={"text"}
                                name={"fullName"}
                                value={this.state.formData.fullName}
                                onChange={this.handleFormChange.bind(this)}
                            />
                        </div>
                        <div className={"form-group"}>
                            <label>Email</label>
                            <input
                                className={"form-control"}
                                type={"email"}
                                name={"email"}
                                value={this.state.formData.email}
                                onChange={this.handleFormChange.bind(this)}
                            />
                        </div>
                        <div className={"form-group"}>
                            <label>Password</label>
                            <input
                                className={"form-control"}
                                type={"password"}
                                name={"password"}
                                value={this.state.formData.password}
                                onChange={this.handleFormChange.bind(this)}
                            />
                        </div>
                        <div className={"form-group"}>
                            <label>Confirm Password</label>
                            <input
                                className={"form-control"}
                                type={"password"}
                                name={"passwordConfirm"}
                                value={this.state.formData.passwordConfirm}
                                onChange={this.handleFormChange.bind(this)}
                            />
                        </div>
                        <div className={"form-group mt-5"}>
                            <input
                                className={"btn btn-primary btn-block"}
                                type={"submit"}
                                value={"Submit"}
                            />
                        </div>
                    </form>
                </div>
            </ReactModal>
        )
    }

    render() {
        return (
            <div className={"p-md-3"}>
                <div className={"my-5"}>
                    User Administration
                </div>
                <CRUDTable
                    headers={["#", "Name", "Role", "Email", ""]}
                    rows={this.state.tableData}
                    onCreate={() => {
                        this.setState({
                            formData: {
                                id: null,
                                fullName: "",
                                isAdmin: false,
                                email: "",
                                password: "",
                                passwordConfirm: ""
                            },
                            isModalVisible: true
                        })
                    }}
                    onUpdate={(payload) => {
                        const copy = {
                            id: payload.id,
                            fullName: payload.fullName,
                            isAdmin: false,
                            email: payload.email,
                            password: "",
                            confirmPassword: ""
                        };
                        this.setState({
                            formData: copy,
                            isModalVisible: true
                        })
                    }}
                    onDelete={this.handleItemDelete.bind(this)}
                />
                {
                    this.state.isModalVisible
                        ? this.renderModal()
                        : null
                }
            </div>
        );
    }
}