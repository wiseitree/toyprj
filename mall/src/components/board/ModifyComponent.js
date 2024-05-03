import {useEffect, useRef, useState} from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import ResultModal from '../common/ResultModal';
import useCustomLogin from '../../hooks/useCustomLogin';
import {deleteOne, getOne, putOne} from '../../api/boardApi';
import {useSelector} from 'react-redux';
import FetchingModal from "../common/FetchingModal";

const initState = {
    bno: 0,
    title: '',
    content: '',
    email: '',
    uploadFileNames: [],
};

const modalState = {
    title: '',
    content: '',
};

const ModifyComponent = ({bno}) => {
    const loginState = useSelector((state) => state.loginSlice);
    const currentMemberEmail = loginState.email;
    const {exceptionHandle} = useCustomLogin();
    const [board, setBoard] = useState({...initState});
    const [boardOwnerEmail, setBoardOwnerEmail] = useState('');
    const [modal, setModal] = useState({...modalState});
    const [fetching, setFetching] = useState(false);
    const uploadRef = useRef();
    const [showFileList, setShowFileList] = useState(false);
    const fileListRef = useRef(null);
    const fileCountRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState('');
    console.log("current board.uploadFileNames", board.uploadFileNames);

    const isModifiable = () => {
        let modifiable = false;

        if (currentMemberEmail === boardOwnerEmail) {
            modifiable = true;
        }

        return modifiable;
    };

    //모달 창을 위한 상태
    const [result, setResult] = useState(null);

    //이동을 위한 기능들
    const {moveToList, moveToRead} = useCustomMove();

    useEffect(() => {
        if (boardOwnerEmail === '') {
            console.log('##### useEffect boardOwnerEmail = ' + boardOwnerEmail);
            return;
        }

        if (currentMemberEmail !== boardOwnerEmail) {
            console.log('useEffect - boardOwnerEmail = ' + boardOwnerEmail);
            alert('잘못된 접근입니다.');
            moveToList();
        }
    }, [boardOwnerEmail]);

    useEffect(() => {
        setFetching(true)
        console.log('useEffect - getOne before');
        getOne(bno)
            .then((data) => {
                setBoard(data);
                setBoardOwnerEmail(data.email);
                setFetching(false)
                console.log('useEffect - getOne - setBoardOwnerEmail');
            })
            .catch((err) => exceptionHandle(err));
    }, [bno]);

    useEffect(() => {
        // Add event listener to detect clicks outside file list area
        const handleClickOutside = (event) => {
            if (fileListRef.current && !fileListRef.current.contains(event.target) && !fileCountRef.current.contains(event.target)) {
                setShowFileList(false);
            }
        };

        // Attach event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickCancel = (bno) => {
        moveToRead(bno);
    };

    const handleClickModify = (board, currentMemberEmail) => {
        const files = uploadRef.current.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        formData.append("title", board.title);
        formData.append("content", board.content);
        formData.append("uploadFileNames", board.uploadFileNames);

        setFetching(true);

        putOne(board.bno, formData, currentMemberEmail)
            .then((data) => {
                setFetching(false);
                closeModal('modified', board.bno);
            })
            .catch((err) => {
                console.log(err);
                alert('제목 및 내용을 올바르게 입력해주세요.');
            });
    };

    const handleClickDelete = (bno, currentMemberEmail) => {
        deleteOne(bno, currentMemberEmail).then((data) => {
            console.log('delete result: ', data);
            const msg = data.result;
            // if (msg === 'fail') {
            //   alert('다른 사람의 게시글을 지울 수 없습니다.');
            //   moveToRead(bno);
            // }
            closeModal('deleted');
        });
    };

    const getOrgFileName = (fileName) => {
        return fileName.substring(37);
    }

    const handleDeleteFile = (fileToBeDeleted) => {
        const resultFileNames = board.uploadFileNames.filter(uploadFileName =>
            uploadFileName !== fileToBeDeleted
        );
        board.uploadFileNames = resultFileNames;
        setBoard({...board});
    };

    const initModal = (modifyType) => {
        if (modifyType === 'delete') {
            setResult('deleted');
            setModal({...modal, title: '삭제', content: '정말 삭제하시겠습니까?'});
        }
        if (modifyType === 'modify') {
            setResult('modified');
            setModal({...modal, title: '수정', content: '정말 수정하시겠습니까?'});
        }
    };

    const handleModal = {
        bno: bno,
        board: board,
        currentMemberEmail: currentMemberEmail,
        handleClickCancel: handleClickCancel,
        handleClickDelete: handleClickDelete,
        handleClickModify: handleClickModify,
    };

    //모달 창이 close될 때
    const closeModal = (result, bno) => {
        if (result === 'deleted') {
            moveToList();
        } else {
            moveToRead(bno);
        }
    };

    const handleChangeBoard = (e) => {
        board[e.target.name] = e.target.value;
        setBoard({...board});
    };

    const calcContentLen = (data) => {
        let curDataLen = '';
        let totalDataLen = '';

        curDataLen = board[data].length;
        if (data === 'title') totalDataLen = 80;
        if (data === 'content') totalDataLen = 2000;

        if (curDataLen > totalDataLen) {
            alert(`최대 ${totalDataLen}자 까지만 입력 가능합니다.`);
            board[data] = board[data].substring(0, totalDataLen);
            setBoard({...board});
        }
        return `${curDataLen}/${totalDataLen}`;
    };

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4">
            {fetching ? <FetchingModal/> : <></>}

            {result ? (
                <ResultModal
                    title={modal.title}
                    content={modal.content}
                    handleModal={handleModal}
                ></ResultModal>
            ) : (
                <></>
            )}

            <div className="flex justify-end ">
                <button
                    type="button"
                    className="rounded p-4 text-xl w-32 text-white bg-gray-400 hover:bg-gray-500"
                    onClick={() => handleClickCancel(bno)}
                    hidden={!isModifiable()}
                >
                    취소
                </button>
                <button
                    type="button"
                    className="rounded p-4 ml-2 text-xl w-32 text-white bg-red-500 hover:bg-red-800"
                    onClick={() => initModal('delete')}
                    hidden={!isModifiable()}
                >
                    삭제
                </button>
                <button
                    type="button"
                    className="rounded p-4 ml-2 text-xl w-32 text-white bg-red-500 hover:bg-red-800"
                    onClick={() => initModal('modify')}
                    hidden={!isModifiable()}
                >
                    수정
                </button>
            </div>

            {/*<div className="flex justify-center mt-10">*/}
            {/*  <div className="relative mb-4 flex w-full flex-wrap items-stretch">*/}
            {/*    <div className="w-1/5 p-6 text-right font-bold">번호</div>*/}
            {/*    <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">*/}
            {/*      {board.bno}*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className="flex justify-end mt-4">
                <div className="mr-4">글번호: {board.bno} </div>
                <div className="mr-4">작성자: {board.writer} </div>
                <div>등록시간: {board.regTime}</div>
            </div>

            <div className="flex relative justify-end">
                <div className="flex justify-end pb-4" ref={fileCountRef}>
                    첨부파일
                    <span className="text-red-600 hover:cursor-pointer"
                          onClick={() => setShowFileList(!showFileList)}
                    >
                        ({board.uploadFileNames.length})
                    </span>
                </div>

                <div ref={fileListRef} className={`flex absolute ${!showFileList ? 'hidden' : ''} top-full overflow-y-auto z-10
                bg-white border-2 border-neutral-300`}>
                    <ul>
                        {board.uploadFileNames.map((fileName, index) => (
                            <div key={index} className="flex items-center"
                                 onMouseEnter={() => setHoveredIndex(index)}
                                 onMouseLeave={() => setHoveredIndex('')}
                            >
                                <li className='hover:underline cursor-pointer'>{getOrgFileName(fileName)}</li>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className={`w-6 h-6 cursor-pointer hover:text-red-600 ${hoveredIndex === index ? '' : 'hidden'}`}
                                    onClick={() => handleDeleteFile(fileName)}
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                </svg>
                            </div>
                        ))}
                    </ul>
                </div>

            </div>


            <div className="flex justify-center">
                <div className="relative mb-10 flex w-full flex-wrap items-stretch">
                    <input
                        className="w-full pb-2 border-b-gray-400 border-b-2 text-2xl font-extrabold"
                        name="title"
                        type={'text'}
                        value={board.title}
                        onChange={handleChangeBoard}
                    ></input>
                    <div className="absolute bottom-0 right-0 text-gray-500">
                        {calcContentLen('title')}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-10 flex w-full flex-wrap items-stretch border-b-gray-400 border-b-2">
                    <textarea
                        className="w-full"
                        name="content"
                        type={'text'}
                        value={board.content}
                        onChange={handleChangeBoard}
                        rows="30"
                    ></textarea>
                    <div className="absolute bottom-0 right-0 text-gray-500">
                        {calcContentLen('content')}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <input ref={uploadRef}
                           className="w-auto"
                           type={'file'} multiple={true}
                    >
                    </input>
                </div>
            </div>

        </div>
    );
};

export default ModifyComponent;
