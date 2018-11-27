import React from "react";
import Grid from "@material-ui/core/Grid";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";

import moment from "moment";

import ProjectForm from "../ProjectForm/ProjectForm";


const ProjectsContainer = () => (<div>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
                  <ProjectForm />
                </MuiPickersUtilsProvider>
              </Grid>              
            </div>
);
export default ProjectsContainer;