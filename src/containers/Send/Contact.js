import { connect } from 'react-redux';
import { writeContact } from '../../actions/send/index';
import { default as ContactUI } from '../../components/Send/Contact';

const mapStateToProps = (state, ownProps) => ({
    text: state.contact,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        writeContact: (input) => {
            dispatch(writeContact(input));
        },
    }
};

const Contact = connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactUI);

export default Contact;