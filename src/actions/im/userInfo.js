const GET_USER_INFO = 'GET_USER_INFO';

const getUserInfo = (userInfo) => {
    return {
        type: GET_USER_INFO,
        payload: {
            userInfo,
        },
    }
};

export { GET_USER_INFO, getUserInfo };