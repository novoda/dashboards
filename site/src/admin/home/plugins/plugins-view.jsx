import React from 'react';
import { ContentView, AddFabView } from '../../../common/common-views'

const toContent = (plugin) => {
    return {
        id: plugin.id,
        title: plugin.name,
        subtitle: plugin.id
    }
}

export const PluginsView = ({ loading, plugins, onDelete }) => {
    if (loading) {
        return (
            <h1>Loading!</h1>
        )
    } else {
        return (
            <div>
                <ContentView
                    content={plugins.map(toContent)}
                    clickThrough="/admin/plugins"
                    onDelete={onDelete} />
                <AddFabView link='/admin/plugins/add' />
            </div>
        )
    }
}
