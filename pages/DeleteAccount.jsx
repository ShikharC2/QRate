import { useState } from "react";
import { RestFilled } from "@ant-design/icons";
import delete_icon from '../assets/delete_icon.png'
import { Divider } from "antd";
import { Button, Input, Space } from 'antd';
import Dialog from "../Components/Dialog";
import { app } from "../FirebaseConfig";
import { getAuth, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail, deleteUser } from "firebase/auth";
import { getDatabase,ref,remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
function DeleteAccount() {
    const auth = getAuth(app);
    const db = getDatabase(app);
    const [errorHidden, setErrorHidden] = useState(true);
    const [showDialog, setDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();
    async function deleteAccount() {
        if (pass.length == 0) {
            setErrorHidden(false)
            return;
        }
        const user = auth.currentUser;
        const uid = user.uid;
        const credential = EmailAuthProvider.credential(
            user.email,
            pass
        );
        try{
            await reauthenticateWithCredential(user,credential);
            await remove(ref(db,"Schools/"+uid+"/"));
            deleteUser(user);
            window.location.reload();
            
        }
        catch(error){
            if(error.code==="auth/invalid-credential"){
                setDialogText("Incorrect password")
                setDialog(true)
            }
            else{
                setDialogText("Please check your internet connection.")
                setDialog(true)
            }

        }

    }
    return (
        <div style={{padding:"10px"}}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <img src={delete_icon} height={200} width={200} />
                <h3>Delete Account</h3>
                <h5>Please read below before deleting this account</h5>

            </div>
            <Divider />
            <ul style={{ marginTop: "20px" }}>
                <li>This account will be permanently deleted.</li>
                <li>Your all saved data will be lost forever and cannot be recovered.</li>

                <li>To use this service again, you have to create a new account.</li>
            </ul>
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
                <h4>What will be deleted:</h4>
                <ul>
                    <li>Your school profile (name, email, settings)</li>
                    <li>All students and attendance records</li>
                    <li>QR codes linked to the students</li>
                    <li>Account access and login credentials</li>
                </ul>
            </div>
            <Divider />
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Space vertical>
                    <Input.Password placeholder="Enter password" style={{ width: "250px" }} value={pass} onChange={(val) => { setPass(val.target.value) }} />
                    <h6 hidden={errorHidden} style={{ color: "red" }}>Enter your password</h6>
                </Space>
                <Button danger type="primary" icon={<RestFilled />} style={{ marginTop: "20px", marginBottom: "20px" }} onClick={deleteAccount}>Delete Account</Button>

            </div>
              <Dialog title={"Something went wrong!"} text={dialogText} isShowing={showDialog} onClose={() => setDialog(false)} />
        </div>
    )
}
export default DeleteAccount;