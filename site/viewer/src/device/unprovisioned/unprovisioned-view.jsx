import React from 'react'
import * as style from './style.css'
import { LogoView } from './logo-view'

export const UnprovisionedView = ({ deviceId, onLogoClicked }) => {
    if (deviceId) {
        return (
            <div className={style.root}>
                <div className={style.logo} onClick={onLogoClicked}>
                    <LogoView />
                </div>
                <div className={style.text}>{deviceId}</div>
            </div >
        )
    } else {
        return null
    }
}
