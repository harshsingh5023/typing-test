import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {auth, db} from '../firebaseConfig';
import Graph from '../Components/Graph'

const ComparePage = () => {

    const {username} = useParams();
const [loggedInUserData, setLoggedInUserData] = useState([]);
const [compareUserData, setCompareUserData] = useState([]);
const [loggedInUserGraphData, setLoggedInUserGraphData] = useState([]);
const [compareUserGraphData, setCompareUserGraphData] = useState([]);
const [uname, setUname] = useState('');

const getUID = async() => {
        const ref = db.collection('usernames').doc(`${username}`);
        const response = await ref.get();
        return response.data().uid;
    }
    
    const getData = async() => {
        const userUID = await getUID();
        const {uid} = auth.currentUser;
        const userRef = db.collection('usernames').where('uid','==',uid);
        console.log(auth.currentUser);
        const resultsRef = db.collection('Results');
        let tempData = [];
        let tempGraphData = [];
        resultsRef.where('userId','==',uid).orderBy('timeStamp','desc').get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                tempData.push({...doc.data()})
                tempGraphData.push([doc.data().timeStamp,doc.data().wpm])
                setLoggedInUserData(tempData);
                // console.log(loggedInUserData)
                setLoggedInUserGraphData(tempGraphData);
            });
        });
        let tempData1= [];
        let tempGraphData1 = [];
        resultsRef.where('userId','==',userUID).orderBy('timeStamp','desc').get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                tempData1.push({...doc.data()})
                tempGraphData1.push([doc.data().timeStamp,doc.data().wpm])
                setCompareUserData(tempData1);
                setCompareUserGraphData(tempGraphData1);
            });
        });
        const h = db.collection('usernames').where('uid','==',uid).get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              setUname(doc.data().uname)
            })
          })
    }
    useEffect(() => {
        getData();
    }, []);
    
    return (
        <>

<div className="compare">
      
            <h1>{uname}</h1>
      <div className="result-graph">
            <Graph graphData={loggedInUserGraphData} type='date' />
      </div>
            <h1>{username}</h1>
      <div className="result-graph">
            <Graph graphData={compareUserGraphData} type='date' />
      </div>
      
    </div>

           
        </>
    );
}

export default ComparePage;
