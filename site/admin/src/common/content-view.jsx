import React from 'react';
import { Link } from 'react-router-dom';
import { GridList } from 'material-ui/GridList';
import { Card, CardHeader } from 'material-ui/Card';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const styles = {
    grid: {
        overflowY: 'auto',
        margin: 16
    },
    card: {
        margin: 8
    },
    optionsMenu: {
        position: 'absolute',
        right: 0,
        zIndex: 1000
    }
};

const toItem = (clickThrough, onDelete) => (item) => {
    return (
        <div style={{ position: 'relative' }}>
            {onDelete
                ? <OptionsMenu onDelete={() => onDelete(item)} />
                : null}
            <Link to={`${clickThrough}/${item.id}`} key={item.id}>
                <Card style={styles.card}>
                    <CardHeader
                        title={item.title}
                        subtitle={item.subtitle} />
                </Card>
            </Link>
        </div >
    )
}

const OptionsMenu = ({ onDelete }) => {
    return (
        <IconMenu style={styles.optionsMenu}
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}>
            <MenuItem primaryText="delete" onClick={onDelete} />
        </IconMenu>
    )
}

export const ContentView = ({ content, clickThrough, onDelete }) => {
    return (
        <GridList
            cellHeight={'auto'}
            cols={3}
            style={styles.grid}>
            {content.map(toItem(clickThrough, onDelete))}
        </GridList>
    )
}
