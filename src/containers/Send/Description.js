import { connect } from 'react-redux';
import { writeDescription } from '../../actions/send/description';
import { uploadPic } from '../../actions/send/uploadPic';
import { deletePic } from '../../actions/send/deletePic';
import { Description as DescriptionUI } from '../../components/Send/Description';

const mapStateToProps = (state, ownProps) => ({
    text: state.description,
    sendBox: ownProps.send,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        writeDescription: (textarea) => {
            dispatch(writeDescription(textarea));
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