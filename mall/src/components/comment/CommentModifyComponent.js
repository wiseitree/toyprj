import {useSelector} from "react-redux";
import {useRef, useState} from "react";
import {putModifyComment} from "../../api/commentApi";

const CommentModifyComponent = ({comment, initModifyCommentIndex, syncCommentList}) => {
    const loginState = useSelector((state) => state.loginSlice);
    const currentMemberEmail = loginState.email;
    const currentMemberNickname = loginState.nickname;
    const [modifyComment, setModifyComment] = useState({...comment});

    const textAreaRef = useRef(null);
    console.log("current comment = ", comment);

    const calcCommentLen = () => {
        const totalCommentLen = 1000;
        let curCommentLen = '';

        curCommentLen = modifyComment["content"].length;
        if (curCommentLen > totalCommentLen) {
            alert(`최대 ${totalCommentLen}자 까지만 입력 가능합니다.`);
            comment.content = comment.content.substring(0, totalCommentLen);
            setModifyComment({...modifyComment});
        }

        return `${curCommentLen}/${totalCommentLen}`;
    };

    const handleChangeModifyComment = (e) => {
        modifyComment[e.target.name] = e.target.value;
        setModifyComment({...modifyComment});
    }

    const handleClickModifyComment = () => {
        putModifyComment(modifyComment.cno, modifyComment, currentMemberEmail)
            .then(() => {
                initModifyCommentIndex();
                syncCommentList();
            })
            .catch((err) => {
                console.error("댓글 수정 실패 = ", err);
            })
    };


    return (
        <div className="border border-gray-300 rounded-md w-full p-4 my-4">
            <div className="flex justify-between">
                <div className="mb-2 font-extrabold">{currentMemberNickname}</div>
                <div className="text-gray-500">{calcCommentLen()}</div>
            </div>

            <textarea
                ref={textAreaRef}
                className="w-full mb-2 outline-none"
                name="content"
                value={modifyComment.content}
                onChange={handleChangeModifyComment}
            >
            </textarea>

            <div className="flex justify-end">
                <button
                    className="flex px-4 py-2 mr-1 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    onClick={() => initModifyCommentIndex()}
                >
                    취소
                </button>
                <button
                    className="flex px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => handleClickModifyComment()}

                >
                    등록
                </button>
            </div>


        </div>

    );


}

export default CommentModifyComponent;