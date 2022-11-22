import { Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useAlert } from "../Context/AlertContext";
import { auth } from "../firebaseConfig";
import {useTheme} from "../Context/ThemeContext";
import errorMapping from "../Utils/ErrorMessages";

const LoginForm = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("initialState");
  const { setAlert } = useAlert();
  const {theme} = useTheme();

  const handleSubmit = () => {
    if (!email || !password) {
      setAlert({
        open: true,
        type: "warning",
        message: "Please enter all details",
      });
      return;
    }
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setAlert({
          open: true,
          type: "success",
          message: "Logged In",
        });
        handleClose();
      })
      .catch((err) => {
        setAlert({
          open: true,
          type: "error",
          message: errorMapping[err.code] || "Some error occrued",
        });
      });
    // console.log(email,password);
  };

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "transparent",
        padding: "10px",
      }}
    >
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        InputLabelProps={{
            style:{color:theme.title}
        }}
        InputProps={{
            style:{color:theme.title}
        }}
        onChange={(e) => setEmail(e.target.value)}
        ></TextField>
      <TextField
        variant="outlined"
        type="password"
        label="Enter Password"
        InputLabelProps={{
            style:{color:theme.title}
        }}
        InputProps={{
            style:{color:theme.title}
        }}
        onChange={(e) => setPassword(e.target.value)}
      ></TextField>
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: theme.title,color: theme.backgroundColor }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
