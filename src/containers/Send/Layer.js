import { connect } from 'react-redux';
import { foldSendBox } from '../../actions/send/coverLayer';
import { default as LayerUI } from '../../components/Send/Layer';

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

const Layer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LayerUI);

export default Layer;