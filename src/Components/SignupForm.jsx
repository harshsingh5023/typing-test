import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useAlert } from '../Context/AlertContext';
import { useTheme } from '../Context/ThemeContext';
import { auth } from '../firebaseConfig';
import errorMapping from '../Utils/ErrorMessages';

const SignupForm = ({handleClose}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {setAlert} = useAlert();
    const {theme} = useTheme();
    const handleSubmit = () => {

        if(!email || !password || !confirmPassword){
            setAlert({
                open: true,
                type: 'warning',
                message: 'Please enter all details'
            });
            return;
        }

        if(password!==confirmPassword){
            setAlert({
                open: true,
                type: 'warning',
                message: 'Password mismatch'
            });
            return;
        }

        auth.createUserWithEmailAndPassword(email, password).then((res) => {
            setAlert({
                open: true,
                type: 'sucess',
                message: 'Account created'
            });
            handleClose();
        }).catch((err) => {
            setAlert({
                open: true,
                type: 'error',
                message: errorMapping[err.code] || 'Some error occrued'
            });
        })

    }

    return (
        <Box
            p={4}
            style={{display: 'flex', flexDirection:'column', gap:'20px', backgroundColor: 'transparent', padding: '10px'}}
        >
            <TextField
                variant='outlined'
                type='email'
                label='Enter Email'
                InputLabelProps={{
                    style:{color:theme.title}
                }}
                InputProps={{
                    style:{color:theme.title}
                }}
                onChange={(e) => (setEmail(e.target.value))}
            >
                
            </TextField>
            <TextField
                variant='outlined'
                type='password'
                label='Enter Password'
                InputLabelProps={{
                    style:{color:theme.title}
                }}
                InputProps={{
                    style:{color:theme.title}
                }}
                onChange={(e) => (setPassword(e.target.value))}
            >

            </TextField>
            <TextField
                variant='outlined'
                type='password'
                label='Confirm Password'
                InputLabelProps={{
                    style:{color:theme.title}
                }}
                InputProps={{
                    style:{color:theme.title}
                }}
                onChange={(e) => (setConfirmPassword(e.target.value))}
            >

            </TextField>
            <Button
                variant='contained'
                size='large'
                style={{ backgroundColor: theme.title,color: theme.backgroundColor }}
                onClick={handleSubmit}
            >
                Signup
            </Button>
        </Box>
    );
}

export default SignupForm;
