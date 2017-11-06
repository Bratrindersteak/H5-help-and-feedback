const WRITE_DESCRIPTION = 'WRITE_DESCRIPTION';
const UPLOAD_PIC = 'UPLOAD_PIC';
const WRITE_CONTACT = 'WRITE_CONTACT';
const SEND_FEEDBACK = 'SEND_FEEDBACK';

const writeDescription = (textarea) => {
    return {
        type: WRITE_DESCRIPTION,
        payload: {
            value: textarea.value,
            count: textarea.value.length,
        },
    }
};

const uploadPic = () => {
    return {
        type: UPLOAD_PIC,
        payload: {

        },
    }
};

const writeContact = (input) => {
    return {
        type: WRITE_CONTACT,
        payload: {
            value: input.value,
        },
    }
};

const sendFeedback = () => {
    return {
        type: SEND_FEEDBACK,
        payload: {

        },
    }
};

export {
    WRITE_DESCRIPTION, UPLOAD_PIC, WRITE_CONTACT, SEND_FEEDBACK,
    writeDescription, uploadPic, writeContact, sendFeedback,
};