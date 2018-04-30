const fs = require('fs')

const _exists = (id) => {
  try {
      fs.accessSync(encodeURIComponent(id) + '.cache')
      return true
  } catch (error) {
      return false
  }
}

const _save = (id, data) => {
  fs.writeFileSync(encodeURIComponent(id) + '.cache', JSON.stringify(data))
}

const _read = (id) => {
  const path = encodeURIComponent(id) + '.cache'
  const data = fs.readFileSync(path)
  return JSON.parse(data)
}

module.exports = {
  hasExpired: (id) => !_exists(id),
  save: (id, viewState) => _save(id, viewState),
  read: (id) => new Promise((resolve, reject) => resolve(_read(id)))
}
