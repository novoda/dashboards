import React from 'react'
import { RaisedButton, TextField, Toggle } from 'material-ui'
import { AppBarView } from '../../common/common-views'

export const TopicView = ({ title, submitLabel, pluginInstances, name, onBack, onNameChanged, onSubmit, onInstanceToggle }) => {
    return (
        <div>
            <AppBarView title={title} onBack={onBack} />

            <TextField id='topic-name' value={name}
                floatingLabelText='Topic name'
                onChange={(event) => onNameChanged(event.target.value)} />

            <InstancesView pluginInstances={pluginInstances} onInstanceToggle={onInstanceToggle} />

            <RaisedButton
                label={submitLabel}
                primary={true}
                onTouchTap={onSubmit}
            />
        </div>
    )
}

const InstancesView = ({ pluginInstances, onInstanceToggle }) => {
    const instanceList = pluginInstances.map(instance => {
        return (
            <Toggle
                key={instance.id}
                label={`${instance.name}`}
                style={{ maxWidth: 300 }}
                onToggle={(event, isToggled) => onInstanceToggle(instance.id, isToggled)}
                toggled={instance.isToggled}
            />
        )
    })
    return (
        <div>
            {instanceList}
        </div>
    )
}
