import { useState, useEffect } from "react";
import { QrReader } from 'react-qr-reader';
import { getDatabase, set, ref, push, get ,update} from "firebase/database";
import { app } from '../FirebaseConfig.js'
import { Html5QrcodeScanner } from "html5-qrcode";
import { getAuth } from "firebase/auth";
function ScanQr() {
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;


    const database = getDatabase(app);
    const [qrText, setQrText] = useState("");
    const[qrName,setQrName] = useState("");


    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: 250,
            },
            false
        );

        scanner.render(
            (decodedText) => {
                presentStudent(decodedText);
            },
            (error) => {
                // ignore scan errors
            }
        );

        return () => {
            scanner.clear();
        };
    }, []);

    async function presentStudent(data) {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const dateKey = day + "-" + month + "-" + year;

        const qrData = data.split("@");

        const studentRef = ref(database, "Schools/"+uid+"/Students/Class_" + qrData[1] + "/" + data + "/");
        const snapshot = await get(studentRef);
        if (!snapshot.exists()) {
            setQrText("Invalid QR");
            return;
        }


        const snapData = snapshot.val();
        setQrName(snapData["Full_Name"])
        setQrText(data)
        update(ref(database, "Schools/"+uid+"/Students/Class_" + qrData[1] + "/" + data + "/Attendance/"), {
            [dateKey]: "Present"
        })

    }




    return (
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div id="qr-reader" style={{height:"auto",width:"350px",marginTop:"50px"}}/>
                <div style={{marginTop:"50px"}}>
                <h4>{qrName}</h4>
                <h4>{qrText}</h4>
                </div>
          
        </div>
    )
}
export default ScanQr;