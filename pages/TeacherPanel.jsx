import { useEffect, useState } from "react";
import StudentList from '../Components/StudentList'
import { app } from '../FirebaseConfig.js'
import { getDatabase, set, ref, push, get } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { Flex, Spin, Row, Col } from 'antd';
function TeacherPanel() {
    const auth = getAuth(app);
    const db = getDatabase(app);
    const [studData, setStudData] = useState([]);
    const[loadingHidden,setLoadingHidden] = useState(false);
    useEffect(() => {
        setLoadingHidden(false);
        async function getAllData() {
            const tempList = [];
            const uid = auth.currentUser.uid;
            const snapshot = await get(ref(db, "Schools/" + uid + "/Students/"))
            if (snapshot.exists()) {
                const data = snapshot.val();
                for (let snapData in data) {
                    for (let childNode in data[snapData]) {
                        let childData = data[snapData][childNode];
                        tempList.push({
                            name: childData["Full_Name"],
                            id: childNode,
                            class: childData["Class"]

                        })
                    }


                }
                setStudData(tempList);
                setLoadingHidden(true)
            }
            else{
                setLoadingHidden(true);
            }
        }
        getAllData();
    }, [])

    return (
        <div style={{marginLeft:"15px",marginRight:"15px",marginTop:"30px"}}>
            <h3>Students List</h3>
            <StudentList studentData={studData} />
            <Row hidden={loadingHidden} justify="center" align="middle" style={{marginTop:"40px"}}>
                <Col>
                    <Spin size="large" />
                </Col>
            </Row>
        </div>
    )
}
export default TeacherPanel;