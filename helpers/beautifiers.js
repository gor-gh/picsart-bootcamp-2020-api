module.exports = {
    topicBeautifier: (topic, token) => {
        return {
            id: topic._id.toString(),
            title: topic.title,
            votingsCount: topic.votes.length,
            votedByMe: topic.votes.includes(token.owner.email),
            canDelete: (token.owner._id.toString() === topic.author._id.toString() && !topic.votes.length)
        }
    }
}