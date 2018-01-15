import React from 'react';
import { ContentView, AddFabView } from '../../common/common-views'

const toContent = (topic) => {
    return {
        id: topic.id,
        title: topic.name,
        subtitle: topic.id
    }
}

export const TopicsView = ({ loading, topics }) => {
    if (loading) {
        return (
            <h1>Loading!</h1>
        );
    } else {
        return (
            <div>
                <ContentView
                    content={topics.map(toContent)}
                    clickThrough='/admin/topics' />
                <AddFabView link='/admin/topics/add' />
            </div>
        );
    }
}
