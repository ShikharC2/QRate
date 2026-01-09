import { useState } from 'react'
import { HashRouter as Router,Routes,Route } from 'react-router-dom'
import Home from  '../pages/Home.jsx'
import TopNav from '../Components/TopNav.jsx'
import Entry from '../pages/Entry.jsx'
import './App.css'
import ScanQr from '../pages/ScanQr.jsx'
import Attendance from '../pages/Attendance.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import AuthHandler from '../authHandler/AuthHandler.jsx'
import TeacherPanel from '../pages/TeacherPanel.jsx'
import StudentDetails from '../pages/StudentDetails.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import Profile from '../pages/Profile.jsx'
import UpdateName from '../pages/UpdateName.jsx'
import UpdateEmail from '../pages/UpdateEmail.jsx'
import UpdatePassword from '../pages/UpdatePassword.jsx'
import DeleteAccount from '../pages/DeleteAccount.jsx'
function App() {

  return (
    <>
        <Router>
      <TopNav />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<AuthHandler><Home/></AuthHandler>} />
        <Route path='/entry' element={<AuthHandler><Entry/></AuthHandler>} />
        <Route path='/scanqr' element={<AuthHandler><ScanQr/></AuthHandler>} />
        <Route path='/attendance'element={<AuthHandler><Attendance/></AuthHandler>} />
        <Route path='/teacher_panel' element={<AuthHandler><TeacherPanel/></AuthHandler>}></Route>
        <Route path='/student_details/:id' element={<AuthHandler><StudentDetails/></AuthHandler>}></Route>
        <Route path='/school_profile' element={<AuthHandler><Profile/></AuthHandler>}></Route>
        <Route path='/update_name' element={<AuthHandler><UpdateName/></AuthHandler>}></Route>
        <Route path='/update_email' element={<AuthHandler><UpdateEmail/></AuthHandler>}></Route>
        <Route path='/update_password' element={<AuthHandler><UpdatePassword/></AuthHandler>}></Route>
        <Route path='/delete_account' element={<AuthHandler><DeleteAccount/></AuthHandler>}></Route>
        <Route path='/register'element={<Register/>}/>
        <Route path='/reset_password' element={<ResetPassword/>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
