import React from 'react'
import { DeviceComponent } from '../device/device-component'
import { PluginInstanceComponent } from '../plugin-instance/plugin-instance-component'
import * as style from './style.css'

export const NovodaView = ({ hasAuthed, selection, onSelect, onSelectInstance, devices, pluginInstances, onSignIn }) => {
    const devicesList = devices.map(device => {
        return (
            <button className={style.text} onClick={() => onSelect(device.id, 'device')}>{device.name}</button>
        )
    })

    const pluginInstancesList = pluginInstances.map(instance => {
        return (
            <button className={style.text} onClick={() => onSelect(instance.id, 'plugin-instance')}>{instance.name}</button>
        )
    })


    if (selection) {
        switch (selection.type) {
            case 'device':
                return <DeviceComponent deviceId={selection.id} />
            case 'plugin-instance':
                return <PluginInstanceComponent instanceId={selection.id} />
        }
    }

    return hasAuthed
        ? <div className={style.root}>
            <h1>Devices</h1>
            {devicesList}
            <h1>Plugin Instances</h1>
            {pluginInstancesList}
        </div>
        : <button onClick={onSignIn}>Sign in</button>
}
