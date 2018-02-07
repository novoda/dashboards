import React from 'react'
import AppBar from 'material-ui/AppBar'
import { IconButton } from 'material-ui'
import { NavigationArrowBack } from 'material-ui/svg-icons'

export const AppBarView = ({ title, onBack }) => {
    return (
        <AppBar
            title={<span>{title}</span>}
            iconElementLeft={<IconButton><NavigationArrowBack /></IconButton>}
            onLeftIconButtonClick={onBack}
        />
    )
}
