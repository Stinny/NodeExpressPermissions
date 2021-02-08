const router = require('express').Router();
const { projects } = require('../data');
const { authUser } = require('../basicAuth');
const {
  canViewProject,
  canDeleteProject,
  scopedProjects,
} = require('../permissions/project');

//route to get only req.user projects
router.get('/', authUser, (req, res) => {
  res.json(scopedProjects(req.user, projects));
});

//route for getting sinlge project
//req.user needs to be owner of that project to view
router.get('/:projectID', setProject, authUser, authGetProject, (req, res) => {
  res.json(req.project);
});

//this function sets the project from the
//give ID in the URL
function setProject(req, res, next) {
  const projectID = parseInt(req.params.projectID);
  req.project = projects.find((project) => project.id === projectID);

  if (req.project == null) {
    res.status(404);
    return res.send('Project was not found.');
  }
  next();
}

function authGetProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(401);
    return res.send('Not Allowed.');
  }
  next();
}

function authDeleteProject(req, res, next) {
  if (!canDeleteProject(req.user, req.project)) {
    res.status(401);
    return res.send('Not Allowed.');
  }
  next();
}

module.exports = router;
