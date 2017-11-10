import { connect } from 'react-redux';
import { default as IMUI } from '../../components/IM/Index';
import { connectWebsocket } from '../../actions/im/connect';
import { messageUpdate } from '../../actions/im/msgUpdate';

const mapStateToProps = (state, ownProps) => ({
    display: state.display.im,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
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