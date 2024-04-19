import { useState } from 'react';
import { postAdd } from '../../api/boardApi';
import ResultModal from '../common/ResultModal';
import useCustomMove from '../../hooks/useCustomMove';
import { getCookie } from '../../util/cookieUtil';

const initState = {
  title: '',
  content: '',
  email: '',
  writer: '',
};

const modalState = {
  title: '',
  content: '',
};

const AddComponent = () => {
  const [board, setBoard] = useState({ ...initState });
  const [modal, setModal] = useState({ ...modalState });

  const [result, setResult] = useState('');

  const { moveToList } = useCustomMove();

  const memberInfo = getCookie('member');
  board.email = memberInfo.email;
  board.writer = memberInfo.nickname;

  const handleChangeBoard = (e) => {
    board[e.target.name] = e.target.value;
    setBoard({ ...board });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleClickAdd();
  };

  const handleClickCancel = (bno) => {
    setResult('');
  };

  const handleClickAddCancel = () => {
    closeModal();
  };

  const handleClickAdd = (board) => {
    postAdd(board)
      .then((result) => {
        // setResult(result.bno);
        // setBoard({ ...initState });
        closeModal();
      })
      .catch((e) => {
        alert('제목 및 내용을 올바르게 입력 해 주세요.');
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
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
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
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="title"
            type={'text'}
            value={board.title}
            onChange={handleChangeBoard}
            autoFocus={true}
          ></input>
          <div className="absolute bottom-0 right-0 text-gray-500">
            {calcContentLen('title')}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">내용</div>
          <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="content"
            type={'text'}
            value={board.content}
            onChange={handleChangeBoard}
            rows="14"
            onKeyDown={handleKeyDown}
          ></textarea>
          <div className="absolute bottom-0 right-0 text-gray-500">
            {calcContentLen('content')}
          </div>
        </div>
      </div>

      <div className="flex justify-end p-4">
        {/*<div className="relative mb-4 flex p-4 flex-wrap items-stretch">*/}
        <button
          type="button"
          className="rounded p-4 mr-2 w-36 bg-gray-400 text-xl  text-white hover:bg-gray-500"
          onClick={() => initModal('cancel')}
        >
          취소
        </button>
        <button
          type="button"
          className="rounded p-4  w-36 bg-blue-500 text-xl  text-white hover:bg-blue-800"
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
