import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SpotlightCard from "../anim/SpotlightCard";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, ButtonGroup } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { app } from '../FirebaseConfig.js'
import Table from 'react-bootstrap/Table';
import { getDatabase, set, ref, push, get } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { Divider, QRCode, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {  Modal} from 'antd';
import AttendanceList from "../Components/AttendanceList.jsx";
import LocalizedModal from "../Components/LocalizedModal.jsx";
function StudentDetails() {

    const { id } = useParams();
    const[name,setName] = useState("");
    const[Fname,setFname] = useState("");
    const[stdId,setStdId] = useState("");
    const[cls,setCls] = useState("");
    const[dob,setDob] = useState("");
    const[attendanceData,setAttendanceData] = useState("");
    const[showModal,setModal] = useState(false);
    

    const auth= getAuth(app);
    const db = getDatabase(app);
    const stdData = id.split("@");
    
    useEffect(()=>{
        setCls(stdData[1])
        async function getData(){
            const tempList = [];
            const sclID = auth.currentUser.uid;
            const snapshot = await get(ref(db,"Schools/"+sclID+"/Students/Class_"+stdData[1]+"/"+id+"/"))
            if(snapshot.exists()){
                const snapData = snapshot.val();
                setName(snapData["Full_Name"])
                setFname(snapData["Father_Name"])
                setStdId(id)
                setDob(snapData["DOB"])
               
            }
            const attenData = snapshot.child("Attendance");
            const attenSnap = attenData.val();
            for(let data in attenSnap){
                tempList.push({
                    date:data,
                    status:attenSnap[data]
                })
                
            }
            setAttendanceData(tempList);
           

        }
        getData();
     
    },[]);

function saveAsPDF() {
  const element = document.getElementById("print_qr");

  html2canvas(element, {
    backgroundColor: "transparent",
    scale: 2,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 1️⃣ Dark full A4 background
    pdf.setFillColor(18, 18, 18); // #121212
    pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

    // 2️⃣ Image size
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // 3️⃣ TOP position (margin from top)
    const topMargin = 15; // mm (change as needed)

    pdf.addImage(imgData, "PNG", 0, topMargin, pdfWidth, imgHeight);

    pdf.save(`${id}.pdf`);
  });
}
    return (
        <div>
            <SpotlightCard>
                <h3 style={{ display: "flex", justifyContent: "center" }}>Student Details</h3>
                 <Table striped bordered hover variant="dark">
      <tbody>
        <tr>
          <td>Name</td>
          <td>{name}</td>
        </tr>
        <tr>
          <td>Father's Name</td>
          <td>{Fname}</td>

        </tr>
        <tr>
          <td>ID</td>

          <td>{id}</td>
        </tr>
         <tr>
          <td>Class</td>
 
          <td>{cls}</td>
        </tr>
         <tr>
          <td>Date of birth</td>
  
          <td>{dob}</td>
        </tr>
      </tbody>
    </Table>
                <h3 style={{ display: "flex", justifyContent: "center" }}>Student QR</h3>
                 <div id='print_qr'>
      <Space hidden={false} vertical align="center" style={{ display: "flex", justifyContent: "center" }}>
    
        <QRCode value={id||"-"} color="black" size={250} iconSize={80} style={{backgroundColor:"white"}}/>
        <h2 style={{color:"rgba(255, 255, 255, 1)"}}>{id}</h2>
        <h2 style={{color:"rgba(255, 255, 255, 1)"}}>{name}</h2>
               
      </Space>
      </div>
       <div hidden={false} style={{ textAlign: "center", marginTop: "20px" }}>
        <Button onClick={saveAsPDF}>Print QR Code</Button>
      </div>
      <Divider style={{ borderColor: '#dedede8e' }}></Divider>
      <h3 style={{marginTop:"50px"}}>Attendance Details</h3>
      <AttendanceList data={attendanceData}/>
      <div style={{display:"flex",justifyContent:"center",marginTop:"50px"}}>
        <Button variant="danger" style={{borderRadius:"25px"}} onClick={()=>{setModal(true)}}>Delete Student</Button>
      </div>
            </SpotlightCard>
              <Space>
        <LocalizedModal studentID={id} showModal={showModal} onClose={()=>setModal(false)}/>
        {/* <Button onClick={confirm}>Confirm</Button> */}
      </Space>
        </div>
    )
}
export default StudentDetails;