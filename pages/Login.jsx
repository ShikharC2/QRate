import { useState } from "react";
import SpotlightCard from "../anim/SpotlightCard";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { app } from "../FirebaseConfig";
import { getAuth,signInWithEmailAndPassword  ,setPersistence, browserLocalPersistence,onAuthStateChanged } from "firebase/auth";
import { Flex, Spin,Row,Col,Switch } from 'antd';
import Dialog from "../Components/Dialog";


function Login() {

  const[sclEmail,setSclEmail] = useState("");
  const[sclPass,setSclPass] = useState("");
  const[dialogText,setDialogText] = useState("");
  const[loading,setLoading] = useState(true);
  const[showDialog,setDialog] = useState(false);

  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home"); // redirect if user exists
      }
      else{
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  function schoolSignIn(e) {
    e.preventDefault();

    // Set persistence before signing in
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, sclEmail, sclPass);
      })
      .then((userCredential) => {
        // Signed in
        navigate("/home");
      })
      .catch((error) => {
        if(error.code === "auth/invalid-credential"){
          setDialogText("Invalid email or password.")
        setDialog(true)
        }
        else{
              setDialogText("Please check your internet connection.")
        setDialog(true)
        }
      });
  }
  if(loading){
    return(
   <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    )
  }
  
  return (


    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "480px", maxWidth: "90vw", marginTop: "5vw" }}>
        <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.13)">
          <Form onSubmit={schoolSignIn}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label >School Email</Form.Label>
              <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="email" placeholder="Enter school email" value={sclEmail} onChange={(text => { setSclEmail(text.target.value) })}/>
              </div>
              <Form.Label style={{ marginTop: "20px" }}>Password</Form.Label>
              <div style={{ display: "flex", flexDirection: "row", gap: "5px" ,marginBottom:"10px"}}>
                <Form.Control style={{ backgroundColor: "rgba(0, 0, 0, 0.78)", border: "none", color: "white" }} required={true} type="password" placeholder="Enter password" value={sclPass} onChange={(text => { setSclPass(text.target.value) })} />
              </div>
               <a href="#reset_password" style={{textDecoration:"none"}}>Forgot password?</a>
              
            </Form.Group>
            {/* <div style={{display:"flex",gap:"10px"}}>
             <Switch defaultChecked/>
             <h6>Remember me</h6>
             </div> */}

            <Button variant="primary" type="submit" style={{ marginTop: 20 }}>
              Login
            </Button>
            <h6 style={{ marginTop: "30px" }}>Don't have an account? <span style={{ color: "rgba(0, 128, 255, 1)" }}><a href="#Register" style={{ textDecoration: "none" }}>Click here</a></span></h6>
          </Form>
        </SpotlightCard></div>
        <Dialog title={"Something went wrong!"} text={dialogText} isShowing={showDialog} onClose={()=>setDialog(false)}/>
    </div>


  )
}
export default Login;