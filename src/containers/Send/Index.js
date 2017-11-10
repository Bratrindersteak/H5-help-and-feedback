import { connect } from 'react-redux';
import { default as SendUI } from '../../components/Send/Index';
import { hideCoverLayer } from '../../actions/send/coverLayer';

const mapStateToProps = (state, ownProps) => ({
    display: state.display.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onTouchStart: () => {
            dispatch(hideCoverLayer());
        },
    }
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;