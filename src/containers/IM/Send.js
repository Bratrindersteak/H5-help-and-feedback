import { connect } from 'react-redux';
import { displaySendBox } from '../../actions/im/connect';
import { default as SendUI } from '../../components/IM/Send';

const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            dispatch(displaySendBox());
        },
    }
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;