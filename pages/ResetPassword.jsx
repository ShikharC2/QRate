
import { useState } from "react";
import SpotlightCard from "../anim/SpotlightCard";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { app } from "../FirebaseConfig";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Flex, Spin, Row, Col, Result } from 'antd';

import Dialog from "../Components/Dialog";

function ResetPassword() {
    const navigate = useNavigate();

    const auth = getAuth(app);
    const [sclEmail, setSclEmail] = useState("");
    const [isLinkSent, setLinkSent] = useState(false);
    const [showDialog, setDialog] = useState(false);
    const[dialogText,setDialogText] = useState("");
    function sendResetLink(e) {
        e.preventDefault();
        sendPasswordResetEmail(auth, sclEmail)
            .then(() => {
                setLinkSent(true)
            })
            .catch((error) => {
                const errorCode = error.code;
                if(errorCode === "auth/invalid-email"){
                setDialogText("Given Email is invalid.")
                setDialog(true);
                }
                else{
                     setDialogText("Please check your internet connection.")
                setDialog(true);
                }
            });

    }
    if (isLinkSent) {
        return (
            <Result
                status="success"
                title={<span style={{ color: "white" }}><b>Password Reset link sent successfully!</b></span>}
                subTitle={<span style={{ color: "white" }}>The reset link has been sent to <b>{sclEmail}</b></span>}
                extra={[
                    <Button type="primary" key="console" onClick={() => { navigate("/") }}>
                        Go to Login
                    </Button>,

                ]}
            />
        )
    }
    else {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "480px", maxWidth: "90vw", marginTop: "10vw" }}>
                    <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.13)">
                        <Form onSubmit={sendResetLink}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label >School Email</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="email" placeholder="Enter school email" value={sclEmail} onChange={(text => { setSclEmail(text.target.value) })} />
                                </div>
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ marginTop: 10 }}>
                                Send reset link
                            </Button>
                            <h6 style={{ marginTop: "30px" }}>Already have an account? <span style={{ color: "rgba(0, 128, 255, 1)" }}><a href="/" style={{ textDecoration: "none" }}>Click here</a></span></h6>
                        </Form>
                    </SpotlightCard></div>
                <Dialog title={"Something went wrong!"} text={dialogText} isShowing={showDialog} onClose={() => setDialog(false)} />

            </div>
        )
    }
}
export default ResetPassword;