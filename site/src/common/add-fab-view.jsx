import React from 'react';
import { Link } from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
    fab: {
        marginRight: 20,
        float: 'right'
    }
};

export const AddFabView = ({ link }) => {
    return (
        <Link to={link}>
            <FloatingActionButton style={styles.fab}>
                <ContentAdd />
            </FloatingActionButton>
        </Link>
    )
}