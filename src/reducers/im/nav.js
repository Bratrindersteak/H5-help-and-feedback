import { FETCH_NAV_SUCCESS } from "../../actions/im/nav";

const nav = (state = [], action) => {
    switch (action.type) {
        case FETCH_NAV_SUCCESS:
            return action.payload.data;
        default:
            return state;
    }
};

export default nav;