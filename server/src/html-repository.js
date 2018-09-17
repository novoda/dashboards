const FIVE_MINUTES = (5 * (60 * 1000))
const THREE_MINUTES = (3 * (60 * 1000))

module.exports = class HtmlRepository {

    constructor(bucket) {
        this.bucket = bucket
    }

    store(pluginInstanceId, html) {
        const rootPath = pluginInstanceId

        const filePath = `${rootPath}/index-${Date.now()}.html`
        const file = this.bucket.file(filePath)
        const expiryTime = Date.now() + FIVE_MINUTES

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
                throw err
            })
    }

    refreshUrl(url) {
        const regex = /(.*)\/(.*html)/
        const filePath = decodeURIComponent(url.match(regex)[2])
        const expiryTime = Date.now() + FIVE_MINUTES
        const file = this.bucket.file(filePath)
        return file.setMetadata({ metadata: { expires: expiryTime } })
            .then(() => this._generateSignedUrl(file, expiryTime))
            .catch(err => {
                console.error('Failed to refresh URL', filePath, err)
                throw err
            })
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
                return Promise.all(files.map(file => {
                    return file.getMetadata().then(result => {
                        return { file: file, metadata: result[0] }
                    })
                }))
            }).then(bundles => {
                const deleteFiles = bundles
                    .map(each => {
                        console.log(each.metadata)
                        return each
                    })
                    .filter(bundle => bundle.metadata.metadata.expires + THREE_MINUTES < Date.now())
                    .map(bundle => {
                        console.log(`delete: ${bundle.file.name}`)
                        return bundle.file
                            .delete()
                            .catch(err => {
                                console.warn('Failed to delete file', bundle.file.name, err)
                            })
                    })
                return Promise.all(deleteFiles)
            })
    }

}
