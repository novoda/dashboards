const DATABASE_ROOT = '/plugin-cache'

const hasExpired = (database, interval) => (id) => {
  const rootRef = database.ref(`${DATABASE_ROOT}/${id}`)
  return rootRef.child('lastUpdated')
    .once('value')
    .then(snapshot => snapshot.val())
    .then(lastUpdated => lastUpdated === null || (lastUpdated < (Date.now() - interval)))
}

const updateData = (ref, data) => {
  return ref.child('data')
    .set(JSON.stringify(data))
}

const updateTimestamp = (ref) => {
  return ref.child('lastUpdated')
    .set(Date.now())
}

const save = (database) => (id, data) => {
  const rootRef = database.ref(`${DATABASE_ROOT}/${id}`)
  const actions = [updateData(rootRef, data), updateTimestamp(rootRef)]
  return Promise.all(actions)
}

const read = (database) => (id) => {
  const rootRef = database.ref(`${DATABASE_ROOT}/${id}`)
  return rootRef.child('data')
    .once('value')
    .then(snapshot => JSON.parse(snapshot.val()))
}

const buildCache = (database, interval) => {
  return {
    hasExpired: hasExpired(database, interval),
    save: save(database),
    read: read(database)
  }
}

module.exports = (database, pluginInstanceId, interval, generateViewState) => {
  const cache = buildCache(database, interval)
  return cache.hasExpired(pluginInstanceId)
    .then(isExpired => {
      if (isExpired) {
        return generateViewState()
          .then((data) => cache.save(pluginInstanceId, data))
          .then(() => cache.read(pluginInstanceId))
      } else {
        return cache.read(pluginInstanceId)
      }
    })
}
