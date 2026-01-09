import {useState,useEffect} from 'react'
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import SpotlightCard from '../anim/SpotlightCard'
import AttendanceList from '../Components/AttendanceList';
import { getDatabase, set, ref, push,get } from "firebase/database";
import { app } from '../FirebaseConfig.js'
import Dialog from '../Components/Dialog.jsx';
import { getAuth } from 'firebase/auth';
import { Html5QrcodeScanner } from "html5-qrcode";
import { Divider } from 'antd';
function Attendance(){
    const auth = getAuth(app);
    const uid = auth.currentUser.uid;
    const database = getDatabase(app);
    const[showModal,setModal] = useState(false);
    const[stdName,setStdName] = useState("");
    const[stdID,setStdID] = useState("");
    const[displayID,setDisplayID] = useState("");
    const[showUser,setShowUser] = useState(true);
    const[dataList,setDataList] = useState([]);
    const[qrText,setQrText] = useState("");


    

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
                    const onlyID = decodedText.split("QRATE-")
                    setStdID(onlyID[1]);
                 
                },
                (error) => {
                    // ignore scan errors
                }
            );
    
            return () => {
                scanner.clear();
            };
        }, []);
    
    async function submitAction(e){
        
        e.preventDefault();
        
        const cred = stdID.split("@");
        const snapshot = await get(ref(database,"Schools/"+uid+"/Students/Class_"+cred[1]+"/QRATE-"+stdID+"/"));
        const tempList = [];
        if(snapshot.exists()){
            const attendanceData = snapshot.child("Attendance").val();
            const nameData = snapshot.val();
            setStdName(nameData["Full_Name"])
            setDisplayID(stdID);
            for(let data in attendanceData){
                tempList.push({
                    date:data,
                    status:attendanceData[data]
                })
            }
     
            setDataList(tempList);
            setShowUser(false)
        }
        else{
            setModal(true)
        }

    }


    return(
        <div style={{marginLeft:"30px",marginRight:"30px",marginTop:"20px"}}>
            <h2 style={{display:"flex",justifyContent:"center",marginBottom:"20px"}}>Check Attendance</h2>
            <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.05)">
            <Form onSubmit={submitAction}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Student ID</Form.Label>
            <div style={{display:"flex",flexDirection:"row",gap:"5px"}}>
                <h3>QRATE-</h3>
            <Form.Control style={{backgroundColor:"rgba(0, 0, 0, 0.78)",border:"none",color:"white"}} required={true} type="text" placeholder="Enter student ID" value={stdID} onChange={(text) => { setStdID(text.target.value) }} />

            </div>

          </Form.Group>
              <Button variant="primary" type="submit" style={{marginTop:30}}>
            Submit
          </Button>
              <Divider style={{ borderColor: '#dedede8e',fontSize:20,color:"white" }}>OR (Scan QR)</Divider>
          <h4 style={{display:"flex",justifyContent:"center",marginTop:"10px"}}></h4>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                
                <div id="qr-reader" style={{height:"auto",width:"350px"}}/>
                <div style={{marginTop:"50px"}}>
                <h4>{""}</h4>
                <h4>{}</h4>
                </div>
          
        </div>

      
        </Form>

            </SpotlightCard>
            <div hidden={showUser}>
            <h3 style={{marginTop:"30px"}}>Student name: <span style={{marginLeft:"20px"}}>{stdName}</span></h3>
            <h3>Student ID: <span style={{marginLeft:"20px"}}>{"QRATE-"+displayID}</span></h3>
            </div>
            <div style={{marginTop:"30px"}}>
            <AttendanceList  data={dataList}/>
            </div>
            <Dialog title={"No data found!"} text={"No student found with given ID"} isShowing={showModal} onClose={()=>setModal(false)}></Dialog>
        </div>
    )
}
export default Attendance