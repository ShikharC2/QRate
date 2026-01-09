import { useEffect, useState } from "react";
import { Row, Col } from 'antd'
import logo from '../assets/logo.png'
import { Button } from "react-bootstrap";
import { app } from '../FirebaseConfig.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, set, ref, push, get ,onValue} from "firebase/database";
function TopNav() {
    const [sclName, setSclName] = useState("");
    const auth = getAuth(app);
    const database = getDatabase(app);

    useEffect(() => {
     let schoolRef = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        schoolRef = ref(database, "Schools/" + uid + "/SchoolName");

        onValue(schoolRef, (snapshot) => {
          setSclName(snapshot.val() || "");
        });
      } else {
        setSclName("");
      }
    });

        return () => unsubscribeAuth(); // removes the listener on unmount
    }, [auth,database]);


    return (
        <>
            <Row style={{ backgroundColor: "rgba(0,0,0,0.5)" }} justify="space-between">

                <Col>
                    <a href="/" style={{ textDecoration: "none", color: "white" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <img style={{ marginLeft: "20px" }} src={logo} height={80} width={80} />
                            <h2>CURATING THE FUTURE</h2>
                        </div></a>
                </Col>
                <Col style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "20px",marginLeft:"20px",marginTop:"10px" }}>
                    <h2>{sclName}</h2>
                </Col>
            </Row>
        </>
    )
}
export default TopNav;