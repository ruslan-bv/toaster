import React from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import Header from './Header';
import Content from './Content';

import { onMessage } from './service/mockServer';

function App() {
  const vertical = 'bottom';
  const horizontal = 'right';

  const [likedSubmissions, setLikedSubmissions] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [currentMessageInfo, setCurrentMessageInfo] = React.useState('');

  const showMessage = (submission) => {
    setOpen(true);
    setCurrentMessage(submission)
    const { data: { email, firstName, lastName } } = submission;
    setCurrentMessageInfo(`${firstName} ${lastName} ${email}`);
  }

  const handleLikeButton = () => {
    const likedMessage = { ...currentMessage };
    likedMessage.data.liked = true;
    setLikedSubmissions((prevState) => [...prevState, likedMessage]);
    setOpen(false);
  }

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
      </Container>
    </>
  );
}

export default App;
