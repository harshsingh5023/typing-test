import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AppBar, Box, Modal, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import LogoutIcon from '@mui/icons-material/Logout';
import { auth,db } from "../firebaseConfig";
import {useAuthState} from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAlert } from "../Context/AlertContext";
import { useTheme } from "../Context/ThemeContext";

const useStyles = makeStyles(() => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
    },
    box: {
        width: 400,
        textAlign: 'center'
    }
}))

const AccountIcon = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const {setAlert} = useAlert();
  
  const handleValueChange = (e, v) => {
    setValue(v);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const navigate = useNavigate();
  
  const logout = ()=> {
    auth.signOut().then((res)=>{
      // alert("Logged Out");
      setAlert({
        open: true,
        type: 'success',
        message: 'Logged Out'
      });
    }).catch((err) => {
      alert("not able to log out")
      setAlert({
        open: true,
        type: 'error',
        message: 'Not able to log out'
      });
    })
  }
  const [user] = useAuthState(auth);
  
  const {theme} = useTheme();
  const handleAccountIconClick = () => {
    if(user){
      navigate('/user');
    }else{
      setOpen(true);
    } 
  }

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(async (res)=>{
      const username = res.user.email.split('@')[0];
      const ref = await db.collection('usernames').doc(username).set({
        uid: res.user.uid,
        uname: username
      }).then((response) => {
        setAlert({
          open: true,
          type: 'success',
          message: 'Logged in'
        });
        handleClose();
      });
    }).catch((err)=>{
      setAlert({
        open: true,
        type: 'error',
        message: 'Not able to sign in with google'
      });
    });
  }


  const classes = useStyles();

  return (
    <div>
      
      <AccountCircleIcon onClick={handleAccountIconClick} style={{cursor: 'pointer'}} />
      {(user) && <LogoutIcon onClick={logout} style={{marginLeft:'5px', cursor:'pointer'}} />}
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <div className={classes.box}>
          <AppBar position='static'
          style={{backgroundColor:'transparent'}}
          >
            <Tabs value={value} onChange={handleValueChange} variant='fullWidth'>
              <Tab label="login" style={{color:theme.title}}></Tab>
              <Tab label="signup" style={{color:theme.title}}></Tab>
            </Tabs>
          </AppBar>
          {value === 0 && <LoginForm handleClose={handleClose} /> }
          {value === 1 && <SignupForm handleClose={handleClose} /> }
          <Box className={classes.box}>
            <span style={{display:'block',padding:'.55rem'}} >OR</span>
            <GoogleButton 
            style={{width:'100%'}}
            onClick={signInWithGoogle}
            />
          
          </Box>



        </div>
      </Modal>
    </div>
  );
};

export default AccountIcon;
