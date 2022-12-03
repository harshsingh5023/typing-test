import { Button, Modal, TextField } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useTheme } from "../Context/ThemeContext";
import { useAlert } from "../Context/AlertContext";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const useStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
  },
  compareBox: {
    width: "auto",
    padding: "1rem",
    border: "1px solid",
    textAlign: "center",
  },
}));

const CompareButton = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { setAlert } = useAlert();
  const { theme } = useTheme();

  const navigate = useNavigate();

  const [user] = useAuthState(auth);

  const handleModal = () => {
    if (user) {
      setOpen(true);
    } else {
      setAlert({
        open: true,
        type: "warning",
        message: "Login to compare",
      });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const checkUserNameAvailability = async () => {
    const ref = db.collection("usernames").doc(`${username}`);
    const response = await ref.get();
    if (response.exists) {
      if (user.uid === response.data().uid) {
        return false;
      }
    }
    return response.exists;
  };
  const handleSubmit = async () => {
    if (await checkUserNameAvailability()) {
      navigate(`/compare/${username}`);
    } else {
      setAlert({
        open: true,
        type: "warning",
        message: "Invalid Username",
      });
    }
  };

  const classes = useStyles();

  return (
    <div>
      <div
        style={{
          cursor: "pointer",
          padding: "0.12rem",
          borderRadius: "5px",
          marginTop: "-3px",
          color: theme.background,
          background: theme.title,
        }}
        className="compare-btn"
        onClick={handleModal}
      >
        Compare
      </div>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        <div className={classes.compareBox}>
          <TextField
            type="text"
            variant="outlined"
            label="Enter username"
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{
              style: { color: theme.title },
            }}
            InputProps={{
              style: { color: theme.title },
            }}
          />
          <Button
            style={{
              background: theme.title,
              color: theme.background,
              marginLeft: "5px",
              marginTop: "10px",
            }}
            onClick={handleSubmit}
          >
            Compare
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CompareButton;
