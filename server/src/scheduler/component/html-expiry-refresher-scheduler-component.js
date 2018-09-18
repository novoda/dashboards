module.exports = (database, htmlRepository) => {
    return {
        tickRate: 3,
        tick: () => {
            console.log('running html expiry refresher')
            return database.ref(`/v2/plugin_instances_data/`)
                .once('value')
                .then(snapshot => {
                    const instancesData = snapshot.val()
                    const refreshedUrls = Object.keys(instancesData)
                        .map(key => {
                            const currentUrl = instancesData[key]
                            return htmlRepository
                                .refreshUrl(currentUrl)
                                .then(refreshedUrl => {
                                    return database.ref(`/v2/plugin_instances_data/${key}`)
                                        .set(refreshedUrl)
                                }).catch(err => {
                                    console.err('refresh url error', err)
                                })
                        })
                    return Promise.all(refreshedUrls)
                })
        }
    }
}
