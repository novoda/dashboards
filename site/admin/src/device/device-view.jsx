import React from 'react'
import {
    IconButton,
    RaisedButton,
    TextField,
    SelectField,
    MenuItem
} from 'material-ui'
import { NavigationArrowBack } from 'material-ui/svg-icons'
import AppBar from 'material-ui/AppBar'

export const DeviceView = ({ title, submitLabel, device, onBack, onDeviceNameChanged, onDeviceIdChanged, onTopicChanged, onSubmit }) => {
    return (
        <div>
            <AppBar
                title={title}
                iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
                onLeftIconButtonTouchTap={onBack}
            />

            <div>
                <TextField
                    id='device-name'
                    value={device.name || ''}
                    floatingLabelText='Device name'
                    onChange={(event) => onDeviceNameChanged(event.target.value)} />
            </div>
            <div>
                <TextField
                    id='device-id'
                    value={device.id || ''}
                    floatingLabelText='Device id'
                    onChange={(event) => onDeviceIdChanged(event.target.value)} />

            </div>
            <SelectField
                value={device.selectedTopicId}
                onChange={(event, index, value) => onTopicChanged(value)}
                floatingLabelText="Topic">
                {
                    device.availableTopics.map(topic => {
                        return (
                            <MenuItem key={topic.id} value={topic.id} primaryText={topic.name} />
                        )
                    })
                }
            </SelectField>
            <div>
                <RaisedButton
                    label={submitLabel}
                    primary={true}
                    onTouchTap={onSubmit}
                />
            </div>
        </div>
    )
}
