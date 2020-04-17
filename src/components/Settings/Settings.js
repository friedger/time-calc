import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Add } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { saveProject, createProject, navigateToApp } from '../../logic/actions/actions';
import { withRouter } from 'react-router-dom';

import GenericButton from '../Button/Button';
import ProjectForm from './ProjectForm';
import GaiaFiles from './GaiaFiles';

const styles = theme => ({
  control: {
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
});

class Settings extends Component {
  state = {
    newTitle: '',
  };

  onNewTitleChanged = event => {
    this.setState({
      newTitle: event.target.value,
    });
  };

  onProjectSelected = event => {
    const selectedProjectId = event.target.value;
    const selectedProject = this.props.projects.find(p => p.id === selectedProjectId);
    this.props.setCurrentProject(this.props.history, selectedProject);
  };

  titleFor = k => {
    const p = this.props.projectsById[k];
    let title;
    if (p && p.title) {
      title = p.title;
    } else {
      title = k;
    }
    return title;
  };
  render() {
    const { classes, currentProject, projects, addProject, history } = this.props;

    return (
      <>
        <ProjectForm currentProject={currentProject} />

        <Grid container>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.control} style={{ margin: '10px' }}>
              <Typography variant="h3">Select current projects</Typography>
              <RadioGroup
                aria-label="Projects"
                name="project"
                className={classes.group}
                value={this.props.selectedProjectId}
                onChange={this.onProjectSelected}
              >
                {projects &&
                  Object.keys(projects).map(k => (
                    <FormControlLabel
                      key={k}
                      value={projects[k].id}
                      control={<Radio />}
                      label={projects[k].title}
                    />
                  ))}
              </RadioGroup>
            </Paper>
          </Grid>
          <Grid container item xs={12} sm={6}>
            <Grid item xs={12}>
              <Paper className={classes.control} style={{ margin: '10px' }}>
                <Typography variant="h3">Create new project</Typography>
                <TextField
                  name="newTitle"
                  label="Customer/Project title"
                  type="text"
                  fullWidth
                  onChange={this.onNewTitleChanged}
                />
                <GenericButton
                  invoke={() => addProject(history, this.state.newTitle)}
                  context={this.props}
                  icon={<Add />}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <GaiaFiles />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.projectlist.projects,
    currentProject: state.projectlist.currentProject,
    selectedProjectId:
      state.projectlist.currentProject && state.projectlist.currentProject.id
        ? state.projectlist.currentProject.id
        : '',
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addProject: (history, newTitle) => {
      dispatch(createProject(newTitle));
      dispatch(navigateToApp(history, true));
    },
    setCurrentProject: (history, project) => {
      dispatch(saveProject(project));
      dispatch(navigateToApp(history, true));
    },
  };
};

Settings.propTypes = {
  classes: PropTypes.object,
  addProject: PropTypes.func,
  setCurrentProject: PropTypes.func,
  history: PropTypes.any.isRequired,
  match: PropTypes.object,
  projects: PropTypes.array,
  timesheetFiles: PropTypes.object,
  sharedFiles: PropTypes.array,
  otherFiles: PropTypes.array,
  currentProject: PropTypes.any,
  selectedProjectId: PropTypes.string,
  projectsById: PropTypes.object,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settings))
);
