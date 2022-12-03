import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Graph from "../Components/Graph";
import { useTheme } from "../Context/ThemeContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserPage = () => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [user, loading] = useAuthState(auth);
  const { theme } = useTheme();
  const [username, setUsername] = useState('');

  const fetchUserData = () => {
    const resultsRef = db.collection("Results");
    let tempData = [];
    let tempGraphData = [];
    const { uid } = auth.currentUser;
    resultsRef
      .where("userId", "==", uid)
      .orderBy("timeStamp", "desc")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          tempData.push({ ...doc.data() });
          tempGraphData.push([doc.data().timeStamp, doc.data().wpm]);
        });
        setData(tempData);
        setGraphData(tempGraphData.reverse());
        setDataLoading(false);
      });
    const h = db.collection('usernames').where('uid','==',uid).get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        setUsername(doc.data().uname)
      })
    })
      // .where("uid", "==", uid)
      // .get().then((snapshot)=>{

      // });
console.log(h)

        };
  useEffect(() => {
    if (!loading) {
      fetchUserData();
    }
  }, [loading]);

  if (loading || dataLoading) {
    return (
      <div className="center-of-screen">
        <CircularProgress size={200} style={{ color: theme.title }} />
      </div>
    );
  }
  return (
    <div className="canvas">
      <div className="user-profile">
        <div className="user">
          <div className="picture">
            <AccountCircleIcon
              style={{
                display: "block",
                transform: "scale(6)",
                margin: "auto",
                marginTop: "3.5rem",
              }}
            />
          </div>
          <div className="info">
            <div className="email">{username}</div>
            <div className="joined-on">{user.metadata.creationTime}</div>
          </div>
        </div>
        <div className="total-times">
          <span>Total Test Taken : {data.length}</span>
        </div>
      </div>
      <div className="result-graph">
        <Graph graphData={graphData} type="date" />
      </div>
      <div className="table">
        <TableContainer style={{ maxHeight: "30rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.title, textAlign: "center" }}>
                  WPM
                </TableCell>
                <TableCell style={{ color: theme.title, textAlign: "center" }}>
                  Accuracy
                </TableCell>
                <TableCell style={{ color: theme.title, textAlign: "center" }}>
                  Characters
                </TableCell>
                <TableCell style={{ color: theme.title, textAlign: "center" }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((i) => (
                <TableRow>
                  <TableCell
                    style={{ color: theme.title, textAlign: "center" }}
                  >
                    {i.wpm}
                  </TableCell>
                  <TableCell
                    style={{ color: theme.title, textAlign: "center" }}
                  >
                    {i.accuracy}
                  </TableCell>
                  <TableCell
                    style={{ color: theme.title, textAlign: "center" }}
                  >
                    {i.characters}
                  </TableCell>
                  <TableCell
                    style={{ color: theme.title, textAlign: "center" }}
                  >
                    {i.timeStamp.toDate().toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default UserPage;
