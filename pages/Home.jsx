import React from "react";
import FlowingMenu from '../menu/FlowingMenu'
import { Button } from "react-bootstrap";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import icon_qrscan from '../assets/icon_qrscan.jpg'
import icon_teacher from '../assets/icon_teacher.jpg'
import icon_student from '../assets/icon_student.jpg'
import icon_attendance from '../assets/icon_attendance.jpg'
import icon_profile from '../assets/icon_profile.jpg'
function Home(){
  
    const demoItems = [
  { link: '#entry', text: 'Add student', image: icon_student },
  { link: '#scanqr', text: 'Scan QR', image: icon_qrscan },
  { link: '#attendance', text: 'Attendance', image: icon_attendance  },
  { link: '#teacher_panel', text: 'Teacher Panel', image: icon_teacher },
  { link: '#school_profile', text: 'School Profile', image: icon_profile },
];
const auth = getAuth(app);
const navigate = useNavigate();

function signout(){
  signOut(auth).then(() => {
  navigate("/");
}).catch((error) => {
  // An error happened.
});

}
    return(
        <>
        <div style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu items={demoItems} />
</div>
<div style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"50px"}}>
<Button variant="secondary" style={{background:"none",borderRadius:"25px",width:"200px",marginBottom:"20px"}} onClick={signout}>Sign Out</Button>
</div>
        
        </>
    )
}
export default Home;