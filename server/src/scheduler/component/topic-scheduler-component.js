module.exports = (database) => {
    return {
        tickRate: 1,
        tick: () => {
            return database.child('/v2/topics_index')
                .once('value')
                .then(snapshot => snapshot.val())
                .then(indexes => {
                    return Object.keys(indexes).map(key => {
                        const index = indexes[key]
                        return {
                            topicId: key,
                            nextIndex: (index.current_index + 1) % index.plugin_instances_count
                        }
                    })
                })
                .then(nextIndexesForTopic => {
                    return Promise.all(nextIndexesForTopic.map(nextIndexForTopic => {
                        const topicId = nextIndexForTopic.topicId
                        return database.child(`/v2/topics_index/${topicId}/current_index`)
                            .set(nextIndexForTopic.nextIndex)
                    }))
                })
        }
    }
}
