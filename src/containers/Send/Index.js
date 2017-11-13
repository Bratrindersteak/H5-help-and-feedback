import { connect } from 'react-redux';
import { default as SendUI } from '../../components/Send/Index';
import { rewritingDescription } from "../../actions/send/description";
import { rewritingContact } from "../../actions/send/contact";
import { foldSendBox } from '../../actions/send/coverLayer';

const mapStateToProps = (state, ownProps) => ({
    display: state.display.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onTouchStart: () => {
            dispatch(foldSendBox());
        },
    }
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;