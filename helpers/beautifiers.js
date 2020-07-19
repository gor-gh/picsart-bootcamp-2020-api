module.exports = {
    topicBeautifier: (topic, token) => {
        return {
            id: topic._id.toString(),
            title: topic.title,
            votingsCount: topic.votes.length,
            votedByMe: topic.votes.includes(token.owner.email),
            canDelete: (token.owner._id.toString() === topic.author._id.toString() && !topic.votes.length)
        }
    },
    projectsBeautifier: (project, token) => {
        return {
            id: project._id.toString(),
            title: project.title,
            description: project.description,
            votingsCount: project.votes.length,
            votedByMe: project.votes.includes(token.owner.email)
        }
    }
}

//5f145760d9c9f050d7a1683a