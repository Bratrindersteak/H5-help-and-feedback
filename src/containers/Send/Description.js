import { connect } from 'react-redux';
import { writeDescription, uploadPic } from '../../actions/send/index';
import { default as DescriptionUI } from '../../components/Send/Description';

const mapStateToProps = (state, ownProps) => ({
    text: state.description,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        writeDescription: (textarea) => {
            dispatch(writeDescription(textarea));
        },
        uploadPic: () => {
            dispatch(uploadPic());
        },
    }
};

const Description = connect(
    mapStateToProps,
    mapDispatchToProps
)(DescriptionUI);

export default Description;