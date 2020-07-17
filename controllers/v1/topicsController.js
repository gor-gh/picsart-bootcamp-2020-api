const Topic = require('../../models/topic');
const Token = require('../../models/token');
const {authenticate} = require('../v1/tokensController');
const {topicBeautifier} = require('../../helpers/beautifiers');
const {canUserVote} = require('../../helpers/validators');

module.exports = {
    create: (req, res) => {
        const {token} = req.headers;
        const {title} = req.body;
        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner',(err, token) => {
                        if(title){
                            Topic.findOne({title},(err, topic) => {
                                if(topic){
                                    res.status(400).send("Topic with the mentioned title already exists");
                                } else {
                                    const newTopic = new Topic({
                                        title,
                                        votes: [],
                                        author: token.owner
                                    });
                                    newTopic.save((err, topic) => {
                                        if(err || !topic){
                                            res.status(500).send("Can't create a topic");
                                        } else {
                                            res.status(200).json(topicBeautifier(topic, token));
                                        }
                                    })
                                }
                            })
                        } else {
                            res.status(400).send("Missing required field");
                        }

                    });
                })
                .catch(err => res.status(401).send(err.message));

        } else {
            res.status(401).send("No token mentioned.");
        }
    },

    vote: (req, res) => {
        const {token} = req.headers;
        const {topicId} = req.params;
        const {type} = req.body;

        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner',(err, token) => {
                        if(type){
                            if(type === 'like' || type === 'unlike'){
                                Topic.findById(topicId, (err, topic) => {
                                    if(err || !topic){
                                        res.status(404).send("Can't find the topic specified");
                                    } else {
                                        if(canUserVote(token.owner, topic, type)){
                                            if(type === 'like'){
                                                const newVotings = [...topic.votes, token.owner.email];
                                                Topic.findByIdAndUpdate(topic._id,
                                                    {votes: newVotings},
                                                    {new: true},
                                                    (err, topic) => {
                                                    res.json(topicBeautifier(topic, token));
                                                })
                                            } else if(type === 'unlike'){
                                                const newVotings = topic.votes.filter(email => email !== token.owner.email);
                                                Topic.findByIdAndUpdate(topic._id,
                                                    {votes: newVotings},
                                                    {new: true},
                                                    (err, topic) => {
                                                        res.json(topicBeautifier(topic, token));
                                                    })
                                            }

                                        } else {
                                            res.status(400).send(`You can't ${type} this topic`);
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
    },

    getAllTopicsInfo: (req, res) => {
        const {token} = req.headers;

        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner', (err, token) => {
                        Topic.find({}, (err, topics) => {
                            if(err || !topics){
                                res.status(404).send("Can't find any topic");
                            } else {
                                const topicsInfo = topics.map(t => topicBeautifier(t, token));
                                res.status(200).json(topicsInfo);
                            }
                        })
                    })
                })
                .catch(err => res.status(401).send(err.message));
        } else {
            res.status(401).send("No token mentioned.");
        }
    },

    deleteTopic: (req, res) => {
        const {token} = req.headers;
        const {topicId} = req.params;

        if(token){
            authenticate(token)
                .then(token => {
                    Token.populate(token, 'owner', (err, token) => {
                        Topic.findById(topicId, (err, topic) => {
                            if(err || !topic){
                                res.status(404).send("Can't find the specified topic.")
                            } else {
                                if(token.owner._id.toString() === topic.author._id.toString() && !topic.votes.length){
                                    Topic.deleteOne({_id: topic._id}, (err) => {
                                        if(err){
                                            res.status(500).send("Can't delete the topic.")
                                        } else {
                                            res.status(200).send("Topic deleted successfully.")
                                        }
                                    })
                                } else {
                                    res.status(403).send("The topic can't be deleted.")
                                }
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