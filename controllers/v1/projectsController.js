const Project = require('../../models/project');
const Token = require('../../models/token');
const { authenticate } = require('../../controllers/v1/tokensController');
const { canUserVote } = require('../../helpers/validators');
const {projectsBeautifier} = require('../../helpers/beautifiers');
const TOKEN_FOR_PROJECT_CREATION = 'r5ISsdQfPcKdjLKoNkPd';

module.exports = {
    create: (req, res) => {
        const { token } = req.headers;
        const {
            title,
            description
        } = req.body;

        if(token === TOKEN_FOR_PROJECT_CREATION){
            if(title && description){
                Project.findOne({title},(err, project) => {
                    if(project){
                        res.status(400).send("Project with the mentioned title already exists.")
                    } else {
                        const newProject = new Project({
                            title,
                            description,
                            votes: []
                        });
                        newProject.save((err, project) => {
                            if(err || !project){
                                res.status(500).send("Can't create the project, there was a problem with server.")
                            } else {
                                res.status(200).send("Project created successfully.")
                            }
                        })
                    }
                })
            } else {
                res.status(400).send("Missing required fields.");
            }
        } else {
            res.status(401).send("Wrong token or not mentioned.");
        }
    },

    getAllProjectsInfo: (req, res) => {
        const {token} = req.headers;

        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner', (err, token) => {
                        Project.find({}, (err, projects) => {
                            if(err || !projects){
                                res.status(500).send("Can't get projects.")
                            } else {
                                const projectsInfo = projects.map(p => projectsBeautifier(p, token));
                                res.status(200).json(projectsInfo);
                            }
                        })
                    })
                })
                .catch(err => res.status(401).send(err.message));
        } else {
            res.status(401).send("No token mentioned.");
        }
    },

    vote: (req, res) => {
        const {token} = req.headers;
        const {projectId} = req.params;
        const {type} = req.body;

        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner',(err, token) => {
                        if(type){
                            if(type === 'like' || type === 'unlike'){
                                Project.findById(projectId, (err, project) => {
                                    if(err || !project){
                                        res.status(404).send("Can't find the specified project.")
                                    } else {
                                        if(canUserVote(token.owner, project, type)){
                                            if(type === 'like'){
                                                const newVotes = [...project.votes, token.owner.email];
                                                Project.findByIdAndUpdate(project._id,
                                                    {votes: newVotes},
                                                    {new: true},
                                                    (err, project) => {
                                                    res.json(projectsBeautifier(project, token))
                                                    });
                                            } else if(type === 'unlike'){
                                                const newVotes = project.votes.filter(email => email !== token.owner.email);
                                                Project.findByIdAndUpdate(project._id,
                                                    {votes: newVotes},
                                                    {new: true},
                                                    (err, project) => {
                                                        res.json(projectsBeautifier(project, token))
                                                    })
                                            }
                                        } else {
                                            res.status(400).send(`You can't ${type} this project.`)
                                        }
                                    }
                                })
                            } else {
                                res.status(400).send("Vote type is invalid");
                            }
                        } else {
                            res.status(400).send("Missing required fields")
                        }
                    })
                })
                .catch(err => res.status(401).send(err.message));
        } else {
            res.status(401).send("No token mentioned.");
        }
    }
}