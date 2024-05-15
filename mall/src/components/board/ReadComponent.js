import {useEffect, useRef, useState} from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomLogin from '../../hooks/useCustomLogin';
import {deleteOne, downloadOne, getOne} from '../../api/boardApi';
import {useSelector} from 'react-redux';
import ResultModal from '../common/ResultModal';
import FetchingModal from "../common/FetchingModal";
import CommentSectionComponent from "../comment/CommentSectionComponent";

const initState = {
    bno: 0,
    title: '',
    content: '',
    writer: '',
    regTime: null,
    updateTime: null,
    email: '',
    uploadFileNames: [],
};

const modalState = {
    title: '',
    content: '',
};

const ReadComponent = ({bno}) => {
    const loginState = useSelector((state) => state.loginSlice);
    const {exceptionHandle} = useCustomLogin();
    const [board, setBoard] = useState({...initState});
    const [boardOwnerEmail, setBoardOwnerEmail] = useState('');
    const {moveToList, moveToModify} = useCustomMove();
    const [result, setResult] = useState('');

    const currentMemberEmail = loginState.email;
    const currentMemberRole = loginState.roleNames;

    const [modal, setModal] = useState({...modalState});
    const [fetching, setFetching] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [showFileList, setShowFileList] = useState(false);
    const fileListRef = useRef(null);
    const fileCountRef = useRef(null);

    const isAdmin = () => {
        let admin = false;
        if (currentMemberRole !== undefined && currentMemberRole.includes('ADMIN')) admin = true;

        return admin;
    };

    const isModifiable = () => {
        let modifiable = false;

        if (currentMemberEmail === boardOwnerEmail) {
            modifiable = true;
        }

        return modifiable;
    };

    useEffect(() => {
        setFetching(true);

        getOne(bno)
            .then((data) => {

                setBoard(data);
                setBoardOwnerEmail(data.email);
                setFileList(data.uploadFileNames);
                setFetching(false)

            })
            .catch((err) => {
                    exceptionHandle(err)
                }
            );
    }, [bno]);
    
    useEffect(() => {
        // Add event listener to detect clicks outside file list area
        const handleClickOutside = (event) => {
            if (!fileListRef.current.contains(event.target) && !fileCountRef.current.contains(event.target)) {
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

    const handleClickDownload = (fileName) => {
        downloadOne(fileName)
            .then((res) => {
                let downloadFileName = fileName;
                const blob = new Blob([res.data]);
                const fileUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = fileUrl;

                const contentDisposition = res.headers['content-disposition'];

                if (contentDisposition){
                    const decodeContentDisposition = decodeURIComponent(contentDisposition);

                    const matchFileName = decodeContentDisposition.match(/filename="(.+)"/);
                    if (matchFileName && matchFileName.length === 2)
                        downloadFileName = matchFileName[1];
                }


                link.setAttribute('download', downloadFileName);
                document.body.appendChild(link);

                link.click();
                window.URL.revokeObjectURL(fileUrl);
                document.body.removeChild(link);
                // link.remove();
                })
            .catch((err) => {
                console.error("첨부파일 다운로드에 실패하였습니다. error = ", err);
            })

    }

    const getOrgFileName = (fileName) => {
        return fileName.substring(37);
    }

    const initModal = (modifyType) => {
        if (modifyType === 'delete') {
            setResult('deleted');
            setModal({...modal, title: '삭제', content: '정말 삭제하시겠습니까?'});
        }
    };

    const handleClickCancel = (bno) => {
        setResult('');
    };

    const handleClickDelete = (bno, currentMemberEmail) => {
        deleteOne(bno, currentMemberEmail).then((data) => {
            closeModal('deleted');
        });
    };



    const handleModal = {
        bno: bno,
        board: board,
        currentMemberEmail: currentMemberEmail,
        handleClickCancel: handleClickCancel,
        handleClickDelete: handleClickDelete,
        handleClickModify: '',
    };

    //모달 창이 close될 때
    const closeModal = (result, bno) => {
        if (result === 'deleted') moveToList();
    };

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4 ">
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

            {/* buttons..........start */}
            <div className="flex justify-end ">
                <button
                    type="button"
                    className="rounded  text-xl p-4 w-32 text-white bg-blue-500 hover:bg-blue-800"
                    onClick={() => moveToList()}
                >
                    목록
                </button>
                <button
                    type="button"
                    className="rounded ml-2 text-xl w-32 text-white bg-blue-500 hover:bg-blue-800"
                    onClick={() => moveToModify(bno)}
                    hidden={!isModifiable()}
                >
                    수정
                </button>
                <button
                    type="button"
                    className="rounded ml-2 text-xl w-32 text-white bg-red-500 hover:bg-red-800"
                    onClick={() => initModal('delete')}
                    hidden={!isAdmin()}
                >
                    삭제
                </button>
            </div>

            {/* 글 정보 */}
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
                        ({fileList.length})
                    </span>
                </div>

                <div ref={fileListRef} className={`flex absolute ${!showFileList ? 'hidden' : ''} top-full overflow-y-auto z-10
                bg-white border-2 border-neutral-300`}>
                    <ul>
                        {fileList.map((fileName, index) => (

                            <li className='flex hover:bg-blue-50 justify-between'
                                /*key={index}*/
                                /*onClick={() => handleClickFileName(fileName)}*/
                            >{/*{getOrgFileName(fileName)}*/}
                                <div className='mr-2'>
                                    <span>{getOrgFileName(fileName)}</span>
                                </div>
                                <div
                                    className='hover:underline cursor-pointer'
                                    onClick={() => handleClickDownload(fileName)}
                                >
                                    <span>다운로드</span>
                                </div>
                            </li>

                        ))}
                    </ul>
                </div>
            </div>


            <div className="flex justify-center">
                <div className="relative mb-10 flex w-full flex-wrap items-stretch">
                    <div className="w-full pb-2 border-b-gray-400 border-b-2 text-2xl font-extrabold">
                        {board.title}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="relative mb-10 flex w-full flex-wrap items-stretch border-b-gray-400 border-b-2">
                    <textarea
                        className="w-full rounded-r outline-none"
                        rows="30"
                        value={board.content}
                        readOnly={true}
                    ></textarea>
                </div>
            </div>

            <CommentSectionComponent bno={bno}></CommentSectionComponent>

        </div>
    );
};

export default ReadComponent;
