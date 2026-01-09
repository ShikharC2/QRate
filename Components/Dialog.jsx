
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
function Dialog({title,text,isShowing,onClose}){
  return (
    <>
      <Modal 
        title={title}
        
        open={isShowing}
        onOk={onClose}
         footer={(_, { OkBtn }) => <OkBtn />}
      >
        {text}
      </Modal>
    </>
  );
};
export default Dialog;