import React from "react";
import Grid from "@material-ui/core/Grid";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import ProjectForm from "../ProjectForm/ProjectForm";

const ProjectsContainer = () => (
  <div>
    <Grid item xs={12}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ProjectForm />
      </MuiPickersUtilsProvider>
    </Grid>
  </div>
);
export default ProjectsContainer;
