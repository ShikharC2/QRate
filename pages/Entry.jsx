import { useState,useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import SpotlightCard from "../anim/SpotlightCard";
import Col from 'react-bootstrap/Col';
import { getDatabase, set, ref, push } from "firebase/database";
import { Input, QRCode, Space } from 'antd';
import Row from 'react-bootstrap/Row';
import { app } from '../FirebaseConfig.js'
import logoCircle from '../assets/logoCircle.png'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getAuth } from 'firebase/auth';
import { DatePicker } from 'antd';


function Entry() {
const auth = getAuth(app);
  const [qrtext, setQrText] = useState('');
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [cls, setCls] = useState("");
  const [qrHidded, setQrHidden] = useState(true);
  const database = getDatabase(app);

  const onChange = (date, dateString) => {
  setDob(dateString)
};

  const submitAction = function (e) {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const reference = ref(database, "Schools/"+uid+"/Sudents/Class_" + cls + "/");
    const UID = push(reference);
    const timeStamp = Date.now();
    const randLetter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 52));
    // const customUID = "QRATE" + UID.key + "&" + cls;
    const customUID = "QRATE-"+timeStamp+randLetter+"@"+cls;

    setQrText(customUID);
    set(ref(database, `Schools/${uid}/Students/Class_${cls}/${customUID}`), {
      Full_Name: fullName,
      Father_Name: fatherName,
      DOB: dob,
      Class: cls,
      createdAt: Date.now()
    });
    setQrHidden(false)
  }

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

    pdf.save(`${qrtext}.pdf`);
  });
}

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: 50 }}>
      <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
        <Form onSubmit={submitAction}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Full name</Form.Label>
            <Form.Control required={true} type="text" placeholder="Enter student full name" value={fullName} onChange={(text) => { setFullName(text.target.value) }} />

          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Father's name</Form.Label>
            <Form.Control required={true} type="text" placeholder="Enter father's name" value={fatherName} onChange={(text) => { setFatherName(text.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "30vw" }}>
            <Form.Label>Date of birth</Form.Label>
            {/* <Form.Control required={true} type="number" placeholder="Enter dob" value={dob} onChange={(text) => { setDob(text.target.value) }} /> */}
            <DatePicker style={{marginLeft:"10px"}} onChange={onChange} format={{format:"DD-MM-YYYY",type:"mask"}} needConfirm required={true}/>
          </Form.Group>


          <Form.Group as={Col} controlId="formGridState" style={{ width: "40vw" }}>
            <Form.Label>Class</Form.Label>
            <Form.Select required={true} value={cls}
              onChange={(e) => {
                setCls(e.target.value);
              }}>
              <option disabled value="">Select Class</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
              <option value="VI">VI</option>
              <option value="VII">VII</option>
              <option value="VIII">VIII</option>
              <option value="IX">IX</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>

            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" style={{marginTop:30}}>
            Submit
          </Button>
        </Form>
      </SpotlightCard>
 <div id='print_qr'>
      <Space hidden={qrHidded} vertical align="center" style={{ display: "flex", justifyContent: "center" ,marginTop:"30px"}}>
        <h2>Student attendance QR generated successfully!</h2>
        <QRCode value={qrtext || "-"} color="black" size={250} iconSize={80} style={{backgroundColor:"white"}}/>
        <h2 style={{color:"rgba(255, 255, 255, 1)"}}>{qrtext}</h2>
        <h2 style={{color:"rgba(255, 255, 255, 1)"}}>{fullName}</h2>
               
      </Space>
      </div>
       <div hidden={qrHidded} style={{ textAlign: "center", marginTop: "20px" }}>
        <Button onClick={saveAsPDF}>Print QR Code</Button>
      </div>

     
    </div>
  )
}
export default Entry;