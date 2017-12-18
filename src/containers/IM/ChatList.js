import { connect } from 'react-redux';
import { default as ChatListUI } from '../../components/IM/ChatList';
import { fetchChatListToken } from "../../actions/im/getToken";
import { picLoading } from '../../actions/im/chatItem';
import { fetchNav } from "../../actions/im/nav";

const mapStateToProps = (state, ownProps) => ({
    list: state.list,
    userInfo: state.userInfo,
    week: state.week,
    nav: state.nav,
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchChatListToken: (feedbackId, offset, size) => {
            dispatch(fetchChatListToken(feedbackId, offset, size));
        },
        picLoading: () => {
            dispatch(picLoading());
        },
        fetchNav: (plat, sver) => {
            dispatch(fetchNav(plat, sver));
        },
    }
};

const ChatList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatListUI);

export default ChatList;