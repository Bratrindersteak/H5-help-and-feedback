import { connect } from 'react-redux';
import { default as SendUI } from '../../components/Send/Index';

const mapStateToProps = (state, ownProps) => ({
    display: state.display.send,
});

const Send = connect(
    mapStateToProps,
)(SendUI);

export default Send;