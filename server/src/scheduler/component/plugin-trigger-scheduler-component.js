const collectAllPlugins = pluginInstancesByPlugin => {
    console.log('> collectAllPlugins:', pluginInstancesByPlugin)
    return Object.keys(pluginInstancesByPlugin).map(pluginKey => {
        const plugin = pluginInstancesByPlugin[pluginKey]
        return Object.keys(plugin).map(pluginInstanceKey => {
            const pluginInstance = plugin[pluginInstanceKey]
            return {
                pluginInstanceId: pluginInstanceKey,
                configuration: pluginInstance.configuration,
                queryUrl: pluginInstance.query_url
            }
        })
    }).reduce(
        (accumulator, current) => accumulator.concat(current),
        []
    )
}

const tickAllPlugins = (projectId) = (pluginInstances) => {
    console.log('> tickAllPlugins:', pluginInstances)
    const queryAllPlugins = pluginInstances.map(instance => {
        const requestPayload = {
            meta: { id: instance.pluginInstanceId },
            configuration: instance.configuration,
            callbackUrl: `https://us-central1-${projectId}.cloudfunctions.net/pluginCallback?pluginInstanceId=${instance.pluginInstanceId}`,
            type: 'query'
        }
        console.log(instance)
        const request = {
            url: instance.queryUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        }
        return http.post(request)
            .catch(error => console.error('Failed to query plugin', instance.queryUrl, error))
    })
    return Promise.all(queryAllPlugins)
}

module.exports = (projectId, http, database) => {
    return {
        tickRate: 1,
        tick: () => {
            console.log('running plugin trigger')
            return database.child('/v2/plugin_instances')
                .once('value')
                .then(snapshot => snapshot.val())
                .then(collectAllPlugins)
                .then(tickAllPlugins(projectId))
        }
    }
}
