import { use, useState } from "react";
import SpotlightCard from "../anim/SpotlightCard";
import { Form } from "react-bootstrap";
import { Button } from "antd";
import { useEffect, useRef } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { app } from "../FirebaseConfig";
import { getAuth, signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MailOutlined, KeyOutlined, UserOutlined, RestOutlined } from "@ant-design/icons";

import Dialog from "../Components/Dialog";
import { get, getDatabase, ref,onValue } from "firebase/database";

const list = ["Update School Name", "Update Email", "Update Password", "Delete Account"]
const icon = [<UserOutlined />, <MailOutlined />, <KeyOutlined />, <RestOutlined />]

function Profile() {

    const auth = getAuth(app);
    const db = getDatabase(app);
    const [sclName, setSclName] = useState("");
    const [sclEmail, setSclEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            setSclEmail(auth.currentUser.email)
            const schoolRef = ref(db, "Schools/" + auth.currentUser.uid + "/SchoolName");

            onValue(schoolRef, (snapshot) => {
                setSclName(snapshot.val() || "");
            });
        }
        getData();
    }, [])

    function linkHandler(idx) {
        if (idx == 0) {
            navigate("/update_name")
        }
        if (idx == 1) {
            navigate("/update_email")
        }
        if (idx == 2) {
            navigate("/update_password")
        }
        if (idx == 3) {
            navigate("/delete_account")
        }

    }


    return (
        <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "40px" }}>
            <h3 style={{ marginBottom: "20px" }}>Profile</h3>

            <Table bordered variant="dark">
                <tbody>
                    <tr>
                        <td>School Name</td>
                        <td>{sclName}</td>
                    </tr>
                    <tr>
                        <td>School Email</td>
                        <td>{sclEmail}</td>

                    </tr>
                    <tr>
                        <td>Password</td>

                        <td>********</td>

                    </tr>
                </tbody>
            </Table>

            
            <div style={{ display: "flex", flexDirection: "column" }}>
                {list.map((item, index) => (
                    <Button key={index} style={{ display: 'flex', justifyContent: "flex-start", height: "60px", fontSize: "20px", marginTop: "20px", overflow: "hidden" }} icon={icon[index]} onClick={(e) => { e.preventDefault(); linkHandler(index) }}>{item}</Button>
                ))}

            </div>
        </div>
    )
}
export default Profile;