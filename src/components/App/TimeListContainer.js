import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import moment from 'moment';

import Form from '../Form/Form';
import TimeList from '../TimeList/TimeList';

const TimeListContainer = () => (
  <div>
    <Grid item xs={12}>
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
        <Form />
      </MuiPickersUtilsProvider>
    </Grid>
    <Grid item xs={12}>
      <Paper>
        <TimeList />
      </Paper>
    </Grid>
  </div>
);
export default TimeListContainer;
