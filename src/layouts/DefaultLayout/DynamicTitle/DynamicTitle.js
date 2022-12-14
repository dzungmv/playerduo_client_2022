import { useEffect } from 'react';

export const DynamicTitle = (title) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};
