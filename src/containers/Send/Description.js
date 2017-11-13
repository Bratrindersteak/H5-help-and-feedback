import { connect } from 'react-redux';
import { Description as DescriptionUI } from '../../components/Send/Description';
import { writingDescription, rewritingDescription } from '../../actions/send/description';
import { uploadPic } from '../../actions/send/uploadPic';
import { deletePic } from '../../actions/send/deletePic';

const mapStateToProps = (state, ownProps) => ({
    text: state.description,
    sendBox: ownProps.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        writingDescription: (textarea) => {
            dispatch(writingDescription(textarea));
        },
        rewritingDescription: () => {
            dispatch(rewritingDescription());
        },
        uploadPic: (files) => {
            dispatch(uploadPic(files));
        },
        deletePic: (src) => {
            dispatch(deletePic(src));
        },
    }
};

const Description = connect(
    mapStateToProps,
    mapDispatchToProps
)(DescriptionUI);

export default Description;