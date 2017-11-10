import { connect } from 'react-redux';
import { default as ChatListUI } from '../../components/IM/ChatList';

const mapStateToProps = (state, ownProps) => ({
    list: state.list,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const ChatList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatListUI);

export default ChatList;