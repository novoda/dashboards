const TWO_MINUTES = (2 * (60 * 1000))

module.exports = class HtmlRepository {

    constructor(bucket) {
        this.bucket = bucket
    }

    store(pluginInstanceId, html) {
        const rootPath = pluginInstanceId

        const filePath = `${rootPath}/index-${Date.now()}.html`
        const file = this.bucket.file(filePath)
        const expiryTime = Date.now() + TWO_MINUTES

        const fileOptions = {
            metadata: {
                contentType: 'text/html',
                metadata: {
                    expires: expiryTime
                }
            },
            public: false
        }

        return file
            .save(html, fileOptions)
            .then(() => this._generateSignedUrl(file, expiryTime))
            .catch(err => {
                console.error('Failed to store plugin html', pluginInstanceId, err)
            })
    }

    refreshUrl(url) {
        const regex = /(.*)\/(.*html)/
        const filePath = decodeURIComponent(url.match(regex)[2])
        const expiryTime = Date.now() + TWO_MINUTES
        const file = this.bucket.file(filePath)
        return file.setMetadata({ metadata: { expires: expiryTime } })
            .then(() => this._generateSignedUrl(file, expiryTime))
    }

    _generateSignedUrl(file, expiryTime) {
        const signedUrlConfig = {
            action: 'read',
            expires: expiryTime
        };
        return file.getSignedUrl(signedUrlConfig)
            .then(urlWrapper => urlWrapper[0])
    }

    pruneExpired() {
        return this.bucket.getFiles()
            .then(filesWrapper => {
                const files = filesWrapper[0]
                const deleteFiles = files
                    .filter(file => file.metadata.metadata.expires < Date.now())
                    .map(file => {
                        console.log(`delete: ${file.name}`)
                        return file
                            .delete()
                            .catch(err => {
                                console.warn('Failed to delete file', file.name, err)
                            })
                    })
                return Promise.all(deleteFiles)
            })
    }

}
