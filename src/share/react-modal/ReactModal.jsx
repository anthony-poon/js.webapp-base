import React from "react";
import "./main.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import $ from "jquery";
import anime from "animejs";
export default class ReactModal extends React.Component{

    domRef = React.createRef();

    componentDidMount() {
        $("body").css("overflow-y", "hidden");
        anime({
            targets: this.domRef.current,
            opacity: 1
        })
    }

    componentWillUnmount() {
        $("body").css("overflow-y", "auto");
    }

    render() {
        return (
            <div className={"react-modal"} style={{
                opacity: 0
            }} ref={this.domRef}>
                <div className={"row h-100"}>
                    <div className={"col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4 mx-auto my-auto "  + (this.props.fullHeight ? "h-100" : "")}>
                        <div className={"react-modal__content"}>
                            <div className={"react-modal__nav"}>
                                <div className={"react-modal__close-btn"} onClick={async () => {
                                    let p = anime({
                                        targets: this.domRef.current,
                                        opacity: 0
                                    });
                                    await p.finished;
                                    this.props.onClose();
                                }}>
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                    />
                                </div>
                                <div className={"react-modal__title ml-3"}>
                                    { this.props.title }
                                </div>
                                <div className={"react-modal__btns"}>
                                    { this.props.buttons }
                                </div>
                                <div className={"react-modal__progress-bar"} style={{
                                    width: this.props.progress+"%"
                                }}/>
                            </div>
                            <div className={"react-modal__body"}>
                                { this.props.children }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

ReactModal.defaultProps = {
    fullHeight: true
};
