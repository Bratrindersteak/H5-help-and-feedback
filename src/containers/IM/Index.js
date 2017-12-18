import { connect } from 'react-redux';
import { default as IMUI } from '../../components/IM/Index';
import { fetchWSToken } from '../../actions/im/wsToken';
import { getUserInfo } from "../../actions/im/userInfo";
import { connectWebsocket } from "../../actions/im/connect";

const mapStateToProps = (state, ownProps) => ({
    display: state.display.im,
    userInfo: state.userInfo,
    status: state.status,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getUserInfo: (userInfo) => {
            dispatch(getUserInfo(userInfo));
        },
        fetchWSToken: () => {
            dispatch(fetchWSToken());
        },
        connectWebsocket: (userInfo) => {
            dispatch(connectWebsocket(userInfo));
        },
    }
};

const IM = connect(
    mapStateToProps,
    mapDispatchToProps,
)(IMUI);

export default IM;