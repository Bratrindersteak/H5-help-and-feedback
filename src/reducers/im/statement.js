import SEND from '../../jsons/send.json';

const statement = (state = SEND.statement, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default statement;