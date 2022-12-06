import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { List, ListItemText } from '@mui/material';

export default function Content({ likedSubmissions }) {

  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      <Typography variant="body1" sx={{fontStyle: 'italic', marginTop: 1}}>
        <List sx ={{ width: '50%' }}>
          {likedSubmissions.map((submission, i) => {
            const personInfo = `${submission.data.firstName} ${submission.data.lastName}, ${submission.data.email}`;
            return (
              <ListItemText>
                {i+1}. {personInfo}
              </ListItemText>
            )
          })}
        </List>
      </Typography>
    </Box>
  );
}
