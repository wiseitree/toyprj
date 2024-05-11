import {useRef, useState} from "react";
import {postRegisterComment} from "../../api/commentApi";
import {useSelector} from "react-redux";

const commentSaveInitState = {
    bno: 0,
    content: '',
    email: '',
    nickname: '',
}

const CommentAddComponent = ({bno, syncCommentList}) => {
    const loginState = useSelector((state) => state.loginSlice);
    const [comment, setComment] = useState({...commentSaveInitState});
    const currentMemberEmail = loginState.email;
    const currentMemberNickname = loginState.nickname;
    const textAreaRef = useRef(null);

    const calcCommentLen = () => {
        const totalCommentLen = 1000;
        let curCommentLen = '';

        curCommentLen = comment["content"].length;
        if (curCommentLen > totalCommentLen) {
            alert(`최대 ${totalCommentLen}자 까지만 입력 가능합니다.`);
            comment.content = comment.content.substring(0, totalCommentLen);
            setComment({...comment});
        }

        return `${curCommentLen}/${totalCommentLen}`;
    };

    const calcTextAreaHeight = () => {
        if (!textAreaRef.current)
            return false;

        let isMaxHeight = false;
        if (textAreaRef.current.scrollHeight >= 480)
            isMaxHeight = true;

        return isMaxHeight;
    };

    const handleChangeComment = (e) => {
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        if (textAreaRef.current.scrollHeight >= 480)
            textAreaRef.current.style.height = "480px";

        comment[e.target.name] = e.target.value;
        setComment({...comment});
    };

    const handleClickCommentRegister = () => {
        comment.bno = bno;
        comment.email = currentMemberEmail;
        comment.nickname = currentMemberNickname;


        postRegisterComment(comment)
            .then((result) => {
                syncCommentList();
                setComment({...comment, content: ''});
            })
            .catch((err) => {
                alert("제목 및 내용을 올바르게 입력해주세요.");
                console.error("댓글 등록 실패 = ", err);
            });
    };

    return (
        <div className="border border-gray-300 rounded-md w-full p-4 my-4">
            <div className="flex justify-between">
                <div className="mb-2 font-extrabold">{currentMemberNickname}</div>
                <div className="text-gray-500">{calcCommentLen()}</div>
            </div>
            <textarea
                ref={textAreaRef}
                className={`w-full mb-2 outline-none ${calcTextAreaHeight() ? 'overflow-y-scroll' : ''}`}
                placeholder="댓글을 남겨보세요."
                name="content"
                type={'text'}
                value={comment.content}
                onChange={handleChangeComment}
            >
            </textarea>

            <div className="flex justify-end">
                <button
                    className="flex px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => handleClickCommentRegister()}
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default CommentAddComponent;