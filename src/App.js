import React from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Header from './Header';
import Content from './Content';

import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions } from './service/mockServer';

function App() {
  const vertical = 'bottom';
  const horizontal = 'right';

  const [loadingState, setLoadingState] = React.useState(false);
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
    try {
      setLoadingState(true);
      const likedMessage = { ...currentMessage };
      likedMessage.data.liked = true;
      setOpen(false);

      await saveLikedFormSubmission(likedMessage);
      setLikedSubmissions((prevState) => [...prevState, likedMessage]);
    } catch (error) {
      setAlertMessage(error);
      setAlertToggle(true);
    } finally {
      setLoadingState(false);
    }
  }

  React.useEffect(() => {
    const receiveSubmissions = async () => {
      try {
        setLoadingState(true);
        const result = await fetchLikedFormSubmissions();
        const { formSubmissions } = result;
        setLikedSubmissions(formSubmissions);
      } catch (error) {
        setAlertMessage(error);
        setAlertToggle(true);
      } finally {
        setLoadingState(false);
      }
    };

    receiveSubmissions();
  }, [])

  React.useEffect(() => {
    onMessage(showMessage);
  }, []);

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
            sx={{ left: '24px', right: 'auto', bottom: '24px', position: 'absolute' }}         
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
        <Backdrop
          sx={{ color: '#1976d2', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingState}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </>
  );
}

export default App;
