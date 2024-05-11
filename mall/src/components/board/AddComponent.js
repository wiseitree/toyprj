import {useEffect, useRef, useState} from 'react';
import { postAdd } from '../../api/boardApi';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';
import { getCookie } from '../../util/cookieUtil';
import FetchingModal from "../common/FetchingModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import {useNavigate} from "react-router-dom";

const initState = {
  title: '',
  content: '',
  email: '',
  writer: '',
  files: [],
};

const modalState = {
  title: '',
  content: '',
};

const AddComponent = () => {
  const [board, setBoard] = useState({ ...initState });
  const [modal, setModal] = useState({ ...modalState });
  const uploadRef = useRef();
  const {exceptionHandle, moveToLogin} = useCustomLogin();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false)
  const [result, setResult] = useState('');

  const { moveToList } = useCustomMove();

  const memberInfo = getCookie('member');

  useEffect(() => {
      if (memberInfo === undefined) {
        alert("로그인 바랍니다.")
        moveToLogin();
        return;
      }
    board.email = memberInfo.email;
    board.writer = memberInfo.nickname;
  }, []);

  const handleChangeBoard = (e) => {
    board[e.target.name] = e.target.value;
    setBoard({ ...board });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') initModal('add')
  };

  const handleClickCancel = (bno) => {
    setResult('');
  };

  const handleClickAddCancel = () => {
    closeModal();
  };

  const handleClickAdd = (board) => {
    const files = uploadRef.current.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("title", board.title)
    formData.append("content", board.content)
    formData.append("email", board.email)
    formData.append("writer", board.writer)

    setFetching(true)

    postAdd(formData)
      .then((data) => {
        setFetching(false);
        closeModal();
      })
      .catch((e) => {
        alert('제목 및 내용을 올바르게 입력 해 주세요.');
        setResult('');
        setFetching(false);
      });
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
      setBoard({ ...board });
    }
    return `${curDataLen}/${totalDataLen}`;
  };

  const initModal = (modifyType) => {
    if (modifyType === 'cancel') {
      setResult('cancel');
      setModal({
        ...modal,
        title: '작성 취소',
        content: '정말 취소하시겠습니까?',
      });
    }

    if (modifyType === 'add') {
      setResult('add');
      setModal({
        ...modal,
        title: '등록',
        content: '정말 등록하시겠습니까?',
      });
    }
  };

  const handleModal = {
    board: board,
    handleClickCancel: handleClickCancel,
    handleClickAdd: handleClickAdd,
    handleClickAddCancel: handleClickAddCancel,
  };

  const closeModal = () => {
    setResult('');
    moveToList();
  };

  return (
      <div className="border-2 border-sky-200 mt-10 m-2 p-4 pt-7">
        {fetching ? <FetchingModal/> : <></>}

        {/* 모달 처리 */}
        {result ? (
            <ResultModal
                title={modal.title}
                content={modal.content}
                handleModal={handleModal}
            />
        ) : (
            <></>
        )}

        <div className="flex justify-center">
          <div className="relative mt-32 mb-10 flex w-full flex-wrap items-stretch">
            <input
                className="w-full pb-2 border-b-gray-400 border-b-2 text-2xl font-extrabold"
                name="title"
                type={'text'}
                value={board.title}
                onChange={handleChangeBoard}
                autoFocus={true}
                placeholder="제목을 입력해 주세요."
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
                onKeyDown={handleKeyDown}
                placeholder="내용을 입력해 주세요."
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

        <div className="flex justify-end">
          {/*<div className="relative mb-4 flex p-4 flex-wrap items-stretch">*/}
          <button
              type="button"
              className="rounded p-4 w-32 bg-gray-400 text-xl  text-white hover:bg-gray-500"
              onClick={() => initModal('cancel')}
          >
            취소
          </button>
          <button
              type="button"
              className="rounded p-4 ml-2 w-32 bg-blue-500 text-xl  text-white hover:bg-blue-800"
              onClick={() => initModal('add')}
          >
            등록
          </button>
          {/*</div>*/}
        </div>
      </div>
  );
};

export default AddComponent;
