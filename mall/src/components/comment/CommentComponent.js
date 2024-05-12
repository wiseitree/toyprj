import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import ResultModal from "../common/ResultModal";
import {deleteComment} from "../../api/commentApi";

const modalInitData = {
    title: '',
    content: '',
};

const CommentComponent = ({comment, index, handleClickModify, syncCommentList}) => {
    const loginState = useSelector((state) => state.loginSlice);
    const currentMemberEmail = loginState.email;
    const currentMemberNickname = loginState.nickname;


    const [modal, setModal] = useState({...modalInitData});
    const [modalState, setModalState] = useState(null);
    const [commentIndex, setCommentIndex] = useState('');
    const commentOptionToolRef = useRef(null);
    const commentOptionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (commentIndex === index && !commentOptionToolRef.current.contains(event.target)
                && !commentOptionsRef.current.contains(event.target)) {
                setCommentIndex('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            console.log("handleClickOutside return handleClickOutside return handleClickOutside return handleClickOutside return handleClickOutside return handleClickOutside return");
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [commentIndex]);

    const handleClickCommentOptionTool = (index) => {
        setCommentIndex(index);

        if (commentIndex === index)
            setCommentIndex('');

    };

    const handleClickCancel = () => {
        closeModal('cancel');
    }
    const handleClickDelete = (cno, currentMemberEmail) => {
        deleteComment(cno, currentMemberEmail)
            .then(() => {
                closeModal('deleted');
                syncCommentList();
            })
            .catch((err) => {
                console.error("댓글 삭제에 실패하였습니다. error = ", err);
            })
    };

    const initModal = (modifyType) => {
        if (modifyType === 'delete') {
            setModalState('delete');
            setModal({...modal, title: '삭제', content: '댓글을 삭제하시겠습니까?'});
        }
    };

    const closeModal = (result) => {
        if (result === 'deleted')
            setModalState(null);

        if (result === 'cancel')
            setModalState(null);
    }

    const handleModal = {
        bno: comment.cno,
        currentMemberEmail: currentMemberEmail,
        handleClickCancel: handleClickCancel,
        handleClickDelete: handleClickDelete,
    };

    return (
        <>
            {modalState ?
                <ResultModal
                    title={modal.title}
                    content={modal.content}
                    handleModal={handleModal}
                >
                </ResultModal>
                :
                <></>

            }
            <li key={index} className="border bg-neutral-50 border-gray-300 rounded-md p-4"
            >
                <div className="flex justify-between">
                    <div>
                        <span className="mb-1 mr-2 text-lg font-bold">{comment.nickname}</span>
                        {comment.nickname === currentMemberNickname ?
                            <span
                                className="py-1 px-1 border-2 border-red-300 rounded-2xl text-red-600 font-medium text-sm">작성자</span>
                            :
                            <></>
                        }
                    </div>
                    {comment.nickname === currentMemberNickname ?
                        <div className="flex relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke-width="1.5" stroke="currentColor"
                                 className="w-8 h-8 hover:cursor-pointer p-1"
                                 ref={commentOptionToolRef}
                                 onClick={() => handleClickCommentOptionTool(index)}
                            >
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"/>
                            </svg>

                            <div
                                className={`flex flex-col text-nowrap absolute ${commentIndex === index ? '' : 'hidden'} right-0 top-full 
                                            z-10 rounded-md space-y-1 p-1 shadow-lg bg-white border-2 border-neutral-300`}
                                ref={commentOptionsRef}
                            >
                                <button
                                    className="flex cursor-pointer hover:text-blue-600"
                                    onClick={() => handleClickModify(index)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 24 24"
                                         stroke-width="1.5" stroke="currentColor"
                                         className="w-6 h-6"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                    </svg>
                                    <span className="ml-1">수정하기</span>
                                </button>
                                <button
                                    className="flex cursor-pointer hover:text-red-600"
                                    onClick={() => initModal('delete')}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor"
                                        className={`w-6 h-6 `}
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                    </svg>
                                    <span className="ml-1">삭제하기</span>
                                </button>
                            </div>
                        </div>
                        :
                        <></>
                    }

                </div>
                <div className="mb-1">{comment.content}</div>
                <div className="flex">
                    <div className="text-sm text-gray-500">{comment.updateTime}</div>
                    {/*답글 쓰기*/}
                </div>
            </li>
        </>
    )
}

export default CommentComponent