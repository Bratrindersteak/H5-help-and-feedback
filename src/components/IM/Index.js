import React, { Component } from 'react';
import ChatList from '../../containers/IM/ChatList';
import Send from '../../containers/IM/Send';

class IM extends Component {
    componentWillMount() {
        let count = 0;
        let timer = setInterval(() => {

            if (window.SohuAppPrivates) {
                let userInfo = JSON.parse(window.SohuAppPrivates);

                this.props.getUserInfo(userInfo);
                this.props.fetchWSToken();
                clearInterval(timer);

                return;
            }

            if (count === 60) {
                this.props.fetchWSToken();
                clearInterval(timer);

                return;
            }

            count += 1;
        }, 50);
    }

    render() {
        const { display, userInfo } = this.props;

        if (userInfo.token) {
            this.props.connectWebsocket(userInfo);
        }

        return (
            <div className="im" style={{ display: display }}>
                <ChatList />
                <Send />
                <div className="loading-icon transparent" id="loading"></div>
                <div className="display-layer" id="displayLayer" style={{ display: 'none' }}><img className="wide reset" src="" /></div>
            </div>
        );
    }
}

export default IM;