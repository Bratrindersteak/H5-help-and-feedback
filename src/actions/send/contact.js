const WRITING_CONTACT = 'WRITING_CONTACT';
const CONTACT_VALUE_INVALID = 'CONTACT_VALUE_INVALID';
const REWRITING_CONTACT = 'REWRITING_CONTACT';

const writingContact = (input) => {
    return {
        type: WRITING_CONTACT,
        payload: {
            value: input.value,
        },
    }
};

const contactValueInvalid = () => {
    return {
        type: CONTACT_VALUE_INVALID,
        payload: {

        },
    }
};

const rewritingContact = () => {
    return {
        type: REWRITING_CONTACT,
        payload: {

        },
    }
};

export {
    WRITING_CONTACT, CONTACT_VALUE_INVALID, REWRITING_CONTACT,
    writingContact, contactValueInvalid, rewritingContact,
};