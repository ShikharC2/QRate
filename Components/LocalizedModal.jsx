import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import {app} from '../FirebaseConfig.js'
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const LocalizedModal = ({studentID,showModal,onClose}) => {
    const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getDatabase(app);
  async function deleteStud(){
    const stdData = studentID.split("&")
    const sclId = auth.currentUser.uid;
    const stdRef = ref(db,"Schools/"+sclId+"/Students/Class_"+stdData[1]+"/"+studentID);
    remove(stdRef).then(()=>{
        navigate("/home");

    })
    

  }
  return (
    <>
      <Modal
        title="QRate"
        open={showModal}
        onOk={deleteStud}
        onCancel={onClose}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete current student?</p>
     
      </Modal>
    </>
  );
};
export default LocalizedModal;