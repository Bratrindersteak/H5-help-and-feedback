import { connect } from 'react-redux';
import { default as ChatListUI } from '../../components/IM/ChatList';
import { fetchChatListToken } from "../../actions/im/getToken";
import { picLoading } from '../../actions/im/chatItem';

const mapStateToProps = (state, ownProps) => ({
    list: state.list,
    userInfo: state.userInfo,
    week: state.week,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchChatListToken: () => {
            dispatch(fetchChatListToken());
        },
        picLoading: () => {
            dispatch(picLoading());
        },
    }
};

const ChatList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatListUI);

export default ChatList;