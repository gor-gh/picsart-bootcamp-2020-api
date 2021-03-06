const Team = require('../../models/team');
const Project = require('../../models/project');
const Token = require('../../models/token');
const Topic = require('../../models/topic');
const User = require('../../models/user');
const {authenticate} = require('./tokensController')
const TOKEN_FOR_TEAM_GENERATION = 'xdUyK8b7zGDGPGW7bIQD7dKlLEG7dCxStvKvIzHHV6ZlBcTsvX';

module.exports = {
    generateTeams: (req, res, next) => {
        const { token } = req.headers;
        const teamNames = ['Linus Torvalds', 'Dennis Ritchie', 'Bjarne Stroustrup', 'Brendan Eich', 'John von Neumann'];

        if(token === TOKEN_FOR_TEAM_GENERATION){
            Team.find({}, (err, teams) => {
                if(teams.length){
                    res.status(400).send("Teams have already been created.")
                } else {
                    User.find({}).limit(20).exec((err, users) => {
                        if(err || !users){
                            res.status(500).send("Can't find users.")
                        } else {
                            const membersArr = [[], [], [], [], []];

                            users.sort((a, b) => {
                                if (a.sex == 'male' && b.sex == 'female') return 1
                                else if (a.sex === b.sex) {
                                    if ((a.jsExperience + a.reactExperience) > (b.jsExperience + b.reactExperience)) {
                                        return -1
                                    }
                                    if ((a.jsExperience + a.reactExperience) < (b.jsExperience + b.reactExperience)) {
                                        return 1
                                    }
                                    if ((a.jsExperience + a.reactExperience) == (b.jsExperience + b.reactExperience)) {
                                        const aTime = new Date(a.birthDate).getTime();
                                        const bTime = new Date(b.birthDate).getTime();
                                        return aTime - bTime
                                    }
                                } else return -1
                            });

                            const confirmityArr = [0, 15, 5, 10];

                            for (i = 0; i < 5; i++) {
                                let arr = [...users.slice(confirmityArr[i], confirmityArr[i] + 5)];
                                if (i % 2 === 1) arr = arr.reverse();
                                arr.forEach((el, index) => {
                                    if (i == 4) console.log(el)
                                    membersArr[index].push(el)
                                })
                            }
                            membersArr.forEach((members, index) => {
                                const newTeam = new Team({
                                    name: teamNames[index],
                                    members: membersArr[index]
                                });
                                newTeam.save((err, team) => {
                                    if(err){
                                        res.status(500).send("There was a problem creating a team.")
                                    }
                                })
                            })
                        }
                    })
                }
            })
        } else {
            res.status(401).send("Wrong token or not mentioned.");
        }
    },

    getTeams: (req, res) => {
        const { token } = req.headers;

        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner', (err, token) => {
                        Team.find({}, (err, teams) => {
                            if(err){
                                res.status(500).send("Problem.")
                            } else {
                                const responseArr = [];
                                teams.forEach(team => {
                                    console.log(team);
                                    Team.populate(team, 'members', (err, team) => {

                                        if(err){
                                            res.status(500).send("Can't get team members.")
                                        } else {
                                            console.log(team);
                                            const teamObect = {
                                                id: team._id,
                                                name: team.name,
                                                topic: team.topic,
                                                project: team.project,
                                                members: team.members.map(member => (
                                                    {
                                                        firstName: member.firstName,
                                                        lastName: member.lastName,
                                                        avatarUrl: member.avatarUrl,
                                                        email: member.email
                                                    }
                                                ))
                                            };

                                            if(responseArr.push(teamObect) === 5){
                                                res.status(200).json(responseArr);
                                            }
                                        }
                                    })
                                })
                            }
                        })
                    })
                })
                .catch(err => res.status(401).send(err.message));
        } else {
            res.status(401).send("No token mentioned.");
        }
    }


}