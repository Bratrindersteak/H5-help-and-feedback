import { connect } from 'react-redux';
import { sendFeedback } from '../../actions/send/send';
import { default as SendUI } from '../../components/Send/Send';

const mapStateToProps = (state, ownProps) => ({
    text: state.send,
    userInfo: state.userInfo,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        sendFeedback: (uid, textarea, img, input) => {
            dispatch(sendFeedback(uid, textarea, img, input));
        },
    }
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;