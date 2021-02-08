const { ROLE } = require('../data');

//middleware function
//returns a single project if the req.user
//is the owner of project
function canViewProject(user, project) {
  return user.role === ROLE.ADMIN || project.userId == user.id;
}

//this is a middleware function
//takes in a user and all projects
//returns projects owned by the req.user only
//unless the user is admin, then all get returned
function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) return projects;
  return projects.filter((project) => project.userId === user.id);
}

//middleware function
//allows for the deletion of a project
//if req.user is the project owner
function canDeletepProject(user, project) {
  return project.userId === user.id;
}

module.exports = { canViewProject, scopedProjects, canDeletepProject };
