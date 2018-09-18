const pluginTriggerComponent = require('./component/plugin-trigger-scheduler-component')
const topicComponent = require('./component/topic-scheduler-component')
const htmlComponent = require('./component/expired-html-scheduler-component')
const htmlRefresherComponent = require('./component/html-expiry-refresher-scheduler-component')

module.exports = class Scheduler {

    constructor(projectId, http, database, htmlRepository) {
        this.components = [
            pluginTriggerComponent(projectId, http, database),
            // topicComponent(database),
            htmlComponent(htmlRepository)
            // htmlRefresherComponent(database, htmlRepository)
        ]
    }

    tick(value) {
        const tickableComponents = this.components
            .filter(component => value % component.tickRate === 0)
            .map(component => component.tick())

        if (tickableComponents.length === 0) {
            return Promise.resolve()
        } else {
            return Promise.all(tickableComponents)
        }
    }

}
