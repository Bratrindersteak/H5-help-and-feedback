const ADD_CHAT_ITEM = 'ADD_CHAT_ITEM';
const PIC_LOADING = 'PIC_LOADING';

const addChatItem = (message) => {
    return {
        type: ADD_CHAT_ITEM,
        payload: {
            message,
        },
    }
}

const picLoading = () => {
    return {
        type: PIC_LOADING,
        payload: {

        },
    }
};

export {
    ADD_CHAT_ITEM, PIC_LOADING,
    addChatItem, picLoading,
};