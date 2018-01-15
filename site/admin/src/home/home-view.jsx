import React from 'react'
import { Tabs, Tab } from 'material-ui/Tabs'
import { DevicesView } from './devices/devices-view'
import { PluginsView } from './plugins/plugins-view'
import { TopicsView } from './topics/topics-view'

export const HomeView = ({ tabSelection, onTabChanged, pluginsView, topicsView, devicesView, onDeleteDevice }) => {
    return (
        <Tabs value={tabSelection} onChange={onTabChanged}>
            <Tab value={0} label="Plugins">
                <PluginsView loading={pluginsView.loading} plugins={pluginsView.plugins} />
            </Tab>
            <Tab value={1} label="Topics">
                <TopicsView loading={topicsView.loading} topics={topicsView.topics} />
            </Tab>
            <Tab value={2} label="Devices">
                <DevicesView loading={devicesView.loading} devices={devicesView.devices} onDelete={onDeleteDevice} />
            </Tab>
        </Tabs >
    )
}
