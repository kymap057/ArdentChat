import React from 'react';
import { 
  Button, 
  InputAdornment, 
  TextField, 
  Typography 
} from '@material-ui/core';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import PersonIcon from '@material-ui/icons/Person';

import DialogWindow from '../../Components/DialogWindow/DialogWindow';
import Logo from '../../Assets/Images/logo.png';
import './LoginPage.css';

export default function LoginPage() {
  let [id, setID] = React.useState(''),
      [name, setName] = React.useState(''),
      [message, setMessage] = React.useState('');

  return (
    <div id="login-form-container">
      <DialogWindow
        showDialog={message !== ''}
        setShowDialog={() => setMessage('')}
        title={"Message"}
        message={message}
      />

      <form id="login-page-form">
        <Typography variant="h2">ArdentChat</Typography>

        <div id="login-page-form-inputs">
          <TextField
            label="ArdentID"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FingerprintIcon />
                </InputAdornment>
              )
            }}
            onChange={event => setID(event.target.value)}
          />

          <TextField
            label="Name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div id="login-form-buttons">
          <Button
            variant="contained" 
            size="large" 
            color="primary"
            onClick={() => sendLoginRequest(id, setMessage)}
          >
              Login
          </Button>

          <Button 
            variant="outlined"
            size="large"
            color="primary"
            onClick={() => sendActivationRequest(id, name, setMessage)}
          >
            Activate
          </Button>
        </div>

        <img src={Logo} alt="Ardent Logo" id="logo" />
      </form>
    </div>
  );
}

function sendLoginRequest(id, msgCallback) {
  fetch(`http://localhost:3001/api/users/${id}`, { method: 'GET' })
    .then(res => {
      if (res.status !== 200) {
        msgCallback(`Invalid Account.`);
      } else {
        msgCallback("Welcome to ArdentChat!");
      }
    })
    .catch(() => msgCallback("Unknown Error Occurred: Try again Later."));
}

function sendActivationRequest(id, name, msgCallback) {
  fetch(`http://localhost:3001/api/users/${id}?name=${name}`, { method: 'POST' })
    .then(res => {
        if (res.status !== 201) {
          msgCallback(`Account Not Created (${res.status} ${res.statusText}): Please Try Later.`);
        } else {
          msgCallback("Account Created: Your Account is Ready.");
        }
    })
    .catch(() => msgCallback("Unknown Error Occurred. Try again Later."));
}