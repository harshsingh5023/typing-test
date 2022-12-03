import React, { useEffect } from 'react';
import Graph from './Graph';
import {auth,db} from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAlert } from '../Context/AlertContext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Stats = ({wpm,accuracy,graphData,correctChars, incorrectChars, missedChars, extraChars,resetTest}) => {

    const [user] = useAuthState(auth);
const {setAlert} = useAlert();

    var timeSet = new Set();
    const newGraph = graphData.filter((i) => {
        if(!timeSet.has(i[0])){
            timeSet.add(i[0]);
            return i;
        }
    })

    const pushResultsToDB = async() =>{
        const resultsRef = db.collection('Results');
        const {uid} = auth.currentUser;

        if(!isNaN(accuracy)){
            await resultsRef.add({
                userId: uid,
                wpm: wpm,
                accuracy: accuracy,
                characters: `${correctChars}/${incorrectChars}/${missedChars}/${extraChars}`,
                timeStamp: new Date()
            }).then((res) => {
                setAlert({
                    open: true,
                    type: 'success',
                    message: 'Result saved to db'
                });
            })
        }else{
            setAlert({
                open: true,
                type: 'error',
                message: 'invalid test'
            });

        }
    }

    useEffect(() => {
    if(user){
        pushResultsToDB();
    }else{
        setAlert({
            open: true,
            type: 'warning',
            message: 'Login to save results'
        });
    }
    }, [])


    return (
        <div className='stats-box'>
            <div className='stats'>
            <div className='left-stats'>
                <div className='title'>WPM</div>
                <div className='subtitle'>{wpm}</div>
                <div className='title'>Accuracy</div>
                <div className='subtitle'>{accuracy}%</div>
                <div className='title'>Characters</div>
                <div className='subtitle'>{correctChars}/{incorrectChars}/{missedChars}/{extraChars}</div>
            <RestartAltIcon onClick={resetTest} className='reset-btn' />
            </div>

            </div>
            <div className='right-stats'>
<Graph graphData={newGraph}  />
            </div>
        </div>
    );
}

export default Stats;
