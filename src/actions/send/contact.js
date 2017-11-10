const WRITE_CONTACT = 'WRITE_CONTACT';

const writeContact = (input) => {
    return {
        type: WRITE_CONTACT,
        payload: {
            value: input.value,
        },
    }
};

export {
    WRITE_CONTACT,
    writeContact,
};