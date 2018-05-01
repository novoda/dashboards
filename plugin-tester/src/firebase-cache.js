const admin = require('firebase-admin')
const database = admin.database()

const DATABASE_ROOT = '/plugin-cache'

const _hasExpired = (id, interval) => {
  const rootRef = database.ref(`${DATABASE_ROOT}/${id}`)
  return rootRef.child('lastUpdated')
    .once('value')
    .then(snapshot => snapshot.val())
    .then(lastUpdated => lastUpdated === null || (lastUpdated > Date.now() + interval))
}

const _updateData = (ref, data) => {
  return ref.child('data')
    .set(JSON.stringify(data))
}

const _updateTimestamp = (ref) => {
  return ref.child('lastUpdated')
    .set(Date.now())
}

const _save = (id, data) => {
  const rootRef = database.ref(`${DATABASE_ROOT}/${id}`)
  const actions = [_updateData(rootRef, data), _updateTimestamp(rootRef)]
  return Promise.all(actions)
}

const _read = (id, interval) => {
  const rootRef = database.ref(`${DATABASE_ROOT}/${id}`)
  return rootRef.child('data')
    .once('value')
    .then(snapshot => JSON.parse(snapshot.val()))
}

module.exports = (interval) => {
  return {
    hasExpired: (id) => _hasExpired(id, interval),
    save: (id, viewState) => _save(id, viewState),
    read: (id) => _read(id, interval)
  }
}
