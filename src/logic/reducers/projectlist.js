import {
  PROJECTS_LOADED,
  CURRENT_PROJECT_CHANGED,
  PROJECT_SAVED
} from "../actions/actions";

export default class ProjectList {
  static dispatch(state = { projects: [], currentProject: {} }, action) {
    if (!ProjectList.instance) {
      ProjectList.instance = new ProjectList();
    }

    return ProjectList.instance.process(state, action);
  }

  process(state, action) {
    this.state = state;
    this.projects = state.projects || [];
    this.action = action;

    switch (action.type) {
      case PROJECTS_LOADED:
        return this.setProjects();
      case CURRENT_PROJECT_CHANGED:
        return this.setCurrentProject();
      case PROJECT_SAVED:
        return this.updateProject();
      default:
        return state;
    }
  }

  setProjects() {
    return {
      ...this.state,
      projects: this.action.projects
    };
  }

  setCurrentProject() {
    return {
      ...this.state,
      currentProject: this.action.project
    };
  }

  updateProject() {
    let project = this.action.project;
    let index = this.state.projects.findIndex(p => p.id === project.id);
    if (index < 0) {
      this.state.projects.push(project);
    } else {
      this.state.projects[index] = project;
    }
    let currentProject;
    if (
      this.state.currentProject &&
      this.state.currentProject.id === project.id
    ) {
      currentProject = project;
    } else {
      currentProject = this.state.currentProject;
    }
    return {
      ...this.state,
      projects: this.state.projects,
      currentProject
    };
  }
}
