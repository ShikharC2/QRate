
import { useState } from "react";
import SpotlightCard from "../anim/SpotlightCard";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { app } from "../FirebaseConfig";
import { getAuth, sendPasswordResetEmail,EmailAuthProvider,reauthenticateWithCredential } from "firebase/auth";
import { Flex, Spin, Row, Col, Result } from 'antd';
import Dialog from "../Components/Dialog";
import { getDatabase, ref, update } from "firebase/database";

function UpdateName() {
    const navigate = useNavigate();
    const db = getDatabase(app)
    const auth = getAuth(app);
    const [sclName, setSclName] = useState("");
    const [sclPass, setSclPass] = useState("");
    const [isUpdated, setNameUpdated] = useState(false);
    const [showDialog, setDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");
    function updateSchoolName(e) {
        e.preventDefault();
        const user = auth.currentUser;
        const uid = user.uid;
     const credential = EmailAuthProvider.credential(
        user.email,
        sclPass
      );

        reauthenticateWithCredential(user, credential).then(() => {
            update(ref(db,"Schools/"+uid+"/"),{
                SchoolName:sclName
            })
            setNameUpdated(true)
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
                title={<span style={{ color: "white" }}><b>School name has been updated successfully!</b></span>}
                subTitle={<span style={{ color: "white" }}>School name has been changed to <b>{sclName}</b></span>}
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
                         <div style={{ display: "flex", justifyContent: "center" }}><h3>Update Name</h3></div>
                        <Form onSubmit={updateSchoolName}>
                            <Form.Group className="mb-3" controlId="formBasicEmail" style={{marginTop:"20px"}}>
                                <Form.Label >New school name</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="text" placeholder="Enter new school name" value={sclName} onChange={(text => { setSclName(text.target.value) })} />
                                </div>
                                <Form.Label style={{ marginTop: "20px" }}>Enter password</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="password" placeholder="Enter Password" value={sclPass} onChange={(text => { setSclPass(text.target.value) })} />
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
export default UpdateName;