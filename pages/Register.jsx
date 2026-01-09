import { useState } from "react";
import SpotlightCard from "../anim/SpotlightCard";
import { Form } from "react-bootstrap";
import { getDatabase, set, ref, push } from "firebase/database";
import { app } from '../FirebaseConfig.js'
import Button from "react-bootstrap/Button";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Dialog from "../Components/Dialog.jsx";
import { Alert, Result } from 'antd';
function Register() {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const [sclName, setSclName] = useState("");
    const [sclEmail, setSclEmail] = useState("");
    const [sclPass, setSclPass] = useState("");
    const [showDialog, setDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");
    const database = getDatabase(app);
    const [userCreated, setUserCreated] = useState(false);


    function registerSchool(e) {
        e.preventDefault();
        if(sclPass.length<6){
            setDialogText("Password cannot be less than six characters.")
            setDialog(true)
            return;
        }
        createUserWithEmailAndPassword(auth, sclEmail, sclPass)
            .then((userCredential) => {
                const sclID = userCredential.user.uid;
                set(ref(database, "Schools/" + sclID + "/"), {
                    SchoolName: sclName
                })
                // navigate("/home");
                setUserCreated(true);

                // Signed up 
                // ...
            })
            .catch((error) => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // ..
                
                if (error.code === "auth/email-already-in-use") {
                    setDialogText("Given Email is already in use.")
                    setDialog(true)
                }
                if (error.code === "auth/invalid-email") {
                    setDialogText("Given Email is invalid")
                    setDialog(true)
                }
                else {
                    setDialogText("Please check your internet connection.")
                    setDialog(true)
                }


            });

    }

    if (userCreated) {
        return (

            <Result
                status="success"
                title={<span style={{ color: "white" }}><b>School Account created successfully!</b></span>}
                subTitle={<span style={{ color: "white" }}><b>{sclName}</b><p>{sclEmail}</p></span>}
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
                <div style={{ width: "480px", maxWidth: "90vw", marginTop: "6vw" }}>
                    <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.13)">
                        <Form onSubmit={registerSchool}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>School Name</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="text" placeholder="Enter school name" value={sclName} onChange={(text => { setSclName(text.target.value) })} />
                                </div>
                                <Form.Label style={{ marginTop: "20px" }}>School Email</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="email" placeholder="Enter school email" value={sclEmail} onChange={(text => { setSclEmail(text.target.value) })} />
                                </div>
                                <Form.Label style={{ marginTop: "20px" }}>Password</Form.Label>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                    <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="password" placeholder="Enter password" value={sclPass} onChange={(text => { setSclPass(text.target.value) })} />
                                </div>

                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ marginTop: 30 }}>
                                Register
                            </Button>
                            <h6 style={{ marginTop: "30px" }}>Already have an account? <span style={{ color: "rgba(0, 128, 255, 1)" }}><a href="/" style={{ textDecoration: "none" }}>Click here</a></span></h6>
                        </Form>
                    </SpotlightCard></div>
                <Dialog title={"Something went wrong!"} text={dialogText} isShowing={showDialog} onClose={() => setDialog(false)} />

            </div>
        )
    }
}
export default Register;