import { connect } from 'react-redux';
import { default as SendUI } from '../../components/Send/Index';

const mapStateToProps = (state, ownProps) => ({
    display: state.display.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const Send = connect(
    mapStateToProps,
    mapDispatchToProps
)(SendUI);

export default Send;