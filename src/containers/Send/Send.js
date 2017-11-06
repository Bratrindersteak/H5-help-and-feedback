import { connect } from 'react-redux';
import { sendFeedback } from '../../actions/send/index';
import { default as SendUI } from '../../components/Send/Send';

const mapStateToProps = (state, ownProps) => ({
    text: state.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        sendFeedback: () => {
            dispatch(sendFeedback());
        },
    }
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;