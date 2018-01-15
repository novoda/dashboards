import React from 'react'
import { ContentView, AddFabView, AppBarView } from '../common/common-views'
import { RaisedButton, TextField } from 'material-ui'

const toContent = (instance) => {
    return {
        id: instance.id,
        title: instance.name,
        subtitle: instance.id
    }
}

export const PluginView = ({ isEditing, plugin, onBack, onUpdateEndpoint, onAddPlugin }) => {
    if (isEditing) {
        return <PluginDetailsView plugin={plugin} onBack={onBack} />
    } else {
        return <AddPluginView
            endpoint={plugin.endpoint}
            onUpdateEndpoint={onUpdateEndpoint}
            onAddPlugin={onAddPlugin}
            onBack={onBack} />
    }
}

const AddPluginView = ({ endpoint, onUpdateEndpoint, onAddPlugin, onBack }) => {
    return (
        <div>
            <AppBarView title={'Add Plugin'} onBack={onBack} />

            <TextField id='plugin-endpoint'
                value={endpoint}
                floatingLabelText='Plugin endpoint'
                onChange={(event) => onUpdateEndpoint(event.target.value)} />

            <br />

            <RaisedButton
                label={'Add'}
                primary={true}
                onTouchTap={onAddPlugin} />
        </div>
    )
}

const PluginDetailsView = ({ plugin, onBack }) => {
    return (
        <div>
            <AppBarView title={plugin.name} onBack={onBack} />
            <ContentView
                content={plugin.instances.map(toContent)}
                clickThrough={`/admin/plugins/${plugin.id}`} />
            <AddFabView link={`/admin/plugins/${plugin.id}/add`} />
        </div>
    );
}
