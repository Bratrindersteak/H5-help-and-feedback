import { connect } from 'react-redux';
import { sendFeedback } from '../../actions/send/send';
import { default as SendUI } from '../../components/Send/Send';

const mapStateToProps = (state, ownProps) => ({
    text: state.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        sendFeedback: (textarea, input) => {
            dispatch(sendFeedback(textarea, input));
        },
    }
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;