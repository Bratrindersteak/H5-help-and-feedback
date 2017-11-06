import { connect } from 'react-redux';
import { default as StatementUI } from '../../components/Send/Statement';

const mapStateToProps = (state, ownProps) => ({
    text: state.statement,
});

const Statement = connect(
    mapStateToProps,
)(StatementUI);

export default Statement;