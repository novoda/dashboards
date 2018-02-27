import React from 'react';
import { ContentView, AddFabView } from '../../common/common-views'

const toContent = (device) => {
    return {
        id: device.id,
        title: device.name,
        subtitle: device.id
    }
}

export const DevicesView = ({ loading, devices, onDelete }) => {
    if (loading) {
        return (
            <h1>Loading!</h1>
        );
    } else {
        return (
            <div>
                <ContentView
                    content={devices.map(toContent)}
                    clickThrough="/admin/devices"
                    onDelete={onDelete} />
                <AddFabView link='/admin/devices/add' />
            </div>
        );
    }
}
