import { Button, Grid, TextField } from '@material-ui/core';
import { replaceVars } from 'components/utils';
import { MailTemplateCtx } from 'context/mail-template';
import { SpreadsheetCtx } from 'context/spreadsheet';
import { UserCtx } from 'context/user.context';
import { useStyles } from 'hooks/useStyles';
import React, { memo, useContext, useState } from 'react';
import send from 'services/MailSender';
import Recipients from './Recipients';

const styles = {
  center: {
    textAlign: 'center' as any,
  },
  searchInput: {
    margin: 'auto',
    width: '90%',
  },
};

const Sender = () => {
  const [mailTemplate] = useContext(MailTemplateCtx);
  const { spreadsheet } = useContext(SpreadsheetCtx);
  const { user } = useContext(UserCtx);
  const [subject, setSubject] = useState('Proszę o wystawienie Faktury');
  const classes = useStyles(styles);
  const recipients = spreadsheet.usersData.filter((data: any) => data.send);
  const dataToSend = recipients.map((userData: any) => {
    if (userData.send) {
      return {
        data: {
          content: replaceVars(mailTemplate, userData),
          subject,
        },
        email: userData.email,
      };
    }
    return;
  });

  const sendEmails = () => {
    if (user !== undefined) {
      send(dataToSend, user);
    }
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  return (
    <Grid item={true} xs={12} className={classes.center}>
      <TextField
        id="standard-search"
        label="Email Title"
        type="search"
        margin="normal"
        className={classes.searchInput}
        value={subject}
        onChange={changeTitle}
      />
      <Recipients />
      <Button
        variant="contained"
        color="primary"
        onClick={sendEmails}
        // disabled={!recipients.length}
      >
        Send
      </Button>
    </Grid>
  );
};

export default memo(Sender);
