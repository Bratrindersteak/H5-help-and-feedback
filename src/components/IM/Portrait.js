import React from 'react';

const Portrait = ({ item, userInfo }) => {
    let profile = item.profilePhoto;

    if (!item.profilePhoto && !item.userStatus) {
        profile = userInfo.userImg;
    }

    if (!item.profilePhoto && item.userStatus) {
        profile = userInfo.serviceImg;
    }

    return (
        <div className="portrait">
            <img src={ profile } width="100%" />
        </div>
    );
};

export default Portrait;