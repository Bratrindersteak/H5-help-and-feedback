import { connect } from 'react-redux';
import { writingContact, rewritingContact } from '../../actions/send/contact';
import { Contact as ContactUI } from '../../components/Send/Contact';
import { viewResize } from "../../actions/send/resize";

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
        focus: () => {
            dispatch(viewResize());
        },
    }
};

const Contact = connect(
    mapStateToProps,
    mapDispatchToProps
)(ContactUI);

export default Contact;