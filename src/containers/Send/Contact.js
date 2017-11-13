import { connect } from 'react-redux';
import { writingContact, rewritingContact } from '../../actions/send/contact';
import { Contact as ContactUI } from '../../components/Send/Contact';

const mapStateToProps = (state, ownProps) => ({
    text: state.contact,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        writingContact: (input) => {
            dispatch(writingContact(input));
        },
        rewritingContact: () => {
            dispatch(rewritingContact());
        },
    }
};

const Contact = connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactUI);

export default Contact;