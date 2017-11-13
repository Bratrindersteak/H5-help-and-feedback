const WRITING_DESCRIPTION = 'WRITING_DESCRIPTION';
const DESCRIPTION_VALUE_INVALID = 'DESCRIPTION_VALUE_INVALID';
const REWRITING_DESCRIPTION = 'REWRITING_DESCRIPTION';

const writingDescription = (textarea) => {
    return {
        type: WRITING_DESCRIPTION,
        payload: {
            value: textarea.value,
            count: textarea.value.length,
        },
    }
};

const descriptionValueInvalid = () => {
    return {
        type: DESCRIPTION_VALUE_INVALID,
        payload: {

        },
    }
};

const rewritingDescription = () => {
    return {
        type: REWRITING_DESCRIPTION,
        payload: {

        },
    }
};

export {
    WRITING_DESCRIPTION, DESCRIPTION_VALUE_INVALID, REWRITING_DESCRIPTION,
    writingDescription, descriptionValueInvalid, rewritingDescription,
};