const WRITE_DESCRIPTION = 'WRITE_DESCRIPTION';

const writeDescription = (textarea) => {
    return {
        type: WRITE_DESCRIPTION,
        payload: {
            value: textarea.value,
            count: textarea.value.length,
        },
    }
};

export {
    WRITE_DESCRIPTION,
    writeDescription,
};