import React from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

import Header from './Header';
import Content from './Content';

import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions } from './service/mockServer';

function App() {
  const vertical = 'bottom';
  const horizontal = 'right';

  const [likedSubmissions, setLikedSubmissions] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [currentMessageInfo, setCurrentMessageInfo] = React.useState('');

  const [alertMessage, setAlertMessage] = React.useState({status: '', message: ''});
  const [alertToggle, setAlertToggle] = React.useState(false);

  const showMessage = (submission) => {
    setOpen(true);
    setCurrentMessage(submission)
    const { data: { email, firstName, lastName } } = submission;
    setCurrentMessageInfo(`${firstName} ${lastName} ${email}`);
  }

  const handleLikeButton = async () => {
    const likedMessage = { ...currentMessage };
    likedMessage.data.liked = true;
    setLikedSubmissions((prevState) => [...prevState, likedMessage]);
    setOpen(false);

    const alertMessage = await saveLikedFormSubmission(likedMessage);
    
    if (alertMessage.status === 500) {
      setAlertMessage(alertMessage);
      setAlertToggle(true);
    }
  }

  React.useEffect(() => {
    onMessage(showMessage);
  }, []);

  React.useEffect(() => {
    const receiveSubmissions = async () => {
      const result = await fetchLikedFormSubmissions();
      if (result.status === 500) {
        setAlertMessage(result);
        setAlertToggle(true);
      } else {
        const { formSubmissions } = result;
        setLikedSubmissions(formSubmissions);
      }
    };

    receiveSubmissions();
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Content likedSubmissions={likedSubmissions} />
        <Snackbar
          open={open}
          autoHideDuration={5000}
          message={currentMessageInfo}
          action={
            <>
              <Button color="inherit" onClick={handleLikeButton} size="small">
                LIKE
              </Button>
              <Button color="inherit" onClick={() => setOpen(false)} size="small">
                <CloseIcon />
              </Button>
            </>
          }
          anchorOrigin={{ vertical, horizontal }}
        />
        {
          alertToggle &&
          <Alert 
            sx={{ left: '24px', right: 'auto', position: 'absolute' }}         
            action={
            <Button onClick={() => setAlertToggle(false)} color="inherit" size="small">
              <CloseIcon />
            </Button>
            } 
            variant="filled" 
            severity="error">
              {alertMessage.status}: {alertMessage.message}
          </Alert>
        }
      </Container>
    </>
  );
}

export default App;
