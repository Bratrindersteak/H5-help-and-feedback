import { connect } from 'react-redux';
import { default as ChatListUI } from '../../components/IM/ChatList';
import { fetchChatListToken } from "../../actions/im/getToken";

const mapStateToProps = (state, ownProps) => ({
    list: state.list,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchChatListToken: () => {
            dispatch(fetchChatListToken());
        },
    }
};

const ChatList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatListUI);

export default ChatList;