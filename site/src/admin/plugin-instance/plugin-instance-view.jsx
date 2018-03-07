import React from 'react'
import { RaisedButton, TextField } from 'material-ui'
import { AppBarView } from '../../common/common-views'

export const PluginInstanceView = ({ title, submitLabel, instanceView, onBack, onConfigurationChanged, onNameChanged, onSubmit }) => {
    return (
        <div>
            <AppBarView
                title={title}
                onBack={onBack}
            />

            <FieldsView
                name={instanceView.instanceName}
                configuration={instanceView.configuration}
                onConfigurationChanged={onConfigurationChanged}
                onNameChanged={onNameChanged}
            />

            <RaisedButton
                label={submitLabel}
                primary={true}
                onTouchTap={onSubmit}
            />
        </div>
    )
}

const FieldsView = ({ name, configuration, onConfigurationChanged, onNameChanged }) => {
    return (
        <div>
            <TextField id='instance-name' value={name || ''}
                floatingLabelText='Instance name'
                onChange={(event) => onNameChanged(event.target.value)} />
            <br />
            <br />
            <h3>Configuration</h3>
            {
                configuration.map((configurationField) => {
                    return (
                        <FieldView
                            key={configurationField.id}
                            configurationField={configurationField}
                            onConfigurationChanged={onConfigurationChanged}
                        />
                    )
                })
            }
            <br />
            <br />
        </div>
    )
}

const FieldView = ({ configurationField, onConfigurationChanged }) => {
    return (
        <div>
            <TextField id={configurationField.id}
                value={configurationField.value || ''}
                floatingLabelText={configurationField.label}
                onChange={(event) => {
                    onConfigurationChanged(configurationField.id, event.target.value)
                }}
            />
        </div>
    )

}
