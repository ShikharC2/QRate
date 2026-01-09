
import { useState } from "react";
import SpotlightCard from "../anim/SpotlightCard";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { app } from "../FirebaseConfig";
import { getAuth, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { Flex, Spin, Row, Col, Result } from 'antd';
import Dialog from "../Components/Dialog";
import { getDatabase, ref, update } from "firebase/database";

function UpdatePassword() {
    const navigate = useNavigate();
    const db = getDatabase(app)
    const auth = getAuth(app);
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [isUpdated, setPassUpdated] = useState(false);
    const [showDialog, setDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");
    function updateSchoolName(e) {
        e.preventDefault();

        if (newPass.length < 6) {
            setDialogText("Password cannot be less than six characters.")
            setNewPass("")
            setConfirmPass("")
            setDialog(true)
            return;
        }
        if (newPass !== confirmPass) {
            setDialogText("Password you entered do not match.")
            setNewPass("")
            setConfirmPass("")
            setDialog(true)
            return;
        }

        const user = auth.currentUser;
        const uid = user.uid;
        const credential = EmailAuthProvider.credential(
            user.email,
            oldPass
        );

        reauthenticateWithCredential(user, credential).then(() => {
            updatePassword(user, confirmPass).then(() => {
                setPassUpdated(true)
            })

        }).catch((error) => {
            if(error.code==="auth/invalid-credential"){
                setDialogText("Invalid Password")
                setDialog(true);
            }
            else{
                setDialogText("Please check your internet connection.")
                setDialog(true)
            }
        });


    }
    if (isUpdated) {
        return (
            <Result
                status="success"
                title={<span style={{ color: "white" }}><b>Your password has been changed successfully!</b></span>}
                subTitle={<span style={{ color: "white" }}></span>}
                extra={[
                    <Button type="primary" key="console" onClick={() => { navigate("/") }}>
                        Go to Home
                    </Button>,

                ]}
            />
        )
    }
    else {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "480px", maxWidth: "90vw", marginTop: "5vw" }}>
                    <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.13)">
                        <div style={{ display: "flex", justifyContent: "center" }}><h3>Update Password</h3></div>
                        <Form onSubmit={updateSchoolName}>
                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{ marginTop: "20px" }}>
                                <Form.Label >Old Password</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="password" placeholder="Enter old password" value={oldPass} onChange={(text => { setOldPass(text.target.value) })} />
                                </div>
                                <Form.Label style={{ marginTop: "20px" }}>New Password</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="password" placeholder="Enter new password" value={newPass} onChange={(text => { setNewPass(text.target.value) })} />
                                </div>
                                <Form.Label style={{ marginTop: "20px" }}>Confirm new password</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="password" placeholder="Re-enter new password" value={confirmPass} onChange={(text => { setConfirmPass(text.target.value) })} />
                                </div>
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ marginTop: 10 }}>
                                Update
                            </Button>

                        </Form>
                    </SpotlightCard></div>
                <Dialog title={"Something went wrong!"} text={dialogText} isShowing={showDialog} onClose={() => setDialog(false)} />

            </div>
        )
    }
}
export default UpdatePassword;