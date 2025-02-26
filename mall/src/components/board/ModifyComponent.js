import { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import ResultModal from '../common/ResultModal';
import useCustomLogin from '../../hooks/useCustomLogin';
import { deleteOne, getOne, putOne } from '../../api/boardApi';
import { useSelector } from 'react-redux';

const initState = {
  bno: 0,
  title: '',
  content: '',
  email: '',
};

const ModifyComponent = ({ bno }) => {
  const loginState = useSelector((state) => state.loginSlice);
  const currentMemberEmail = loginState.email;
  const { exceptionHandle } = useCustomLogin();
  const [board, setBoard] = useState({ ...initState });
  const [boardOwnerEmail, setBoardOwnerEmail] = useState('');
  console.log('currentMemberEmail = ' + currentMemberEmail);
  console.log('boardOwnerEmail = ' + boardOwnerEmail);

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
  const { moveToList, moveToRead } = useCustomMove();

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
    console.log('useEffect - getOne before');
    getOne(bno)
      .then((data) => {
        setBoard(data);
        setBoardOwnerEmail(data.email);
        console.log('useEffect - getOne - setBoardOwnerEmail');
      })
      .catch((err) => exceptionHandle(err));
  }, [bno]);

  const handleClickCancel = () => {
    moveToRead(bno);
  };

  const handleClickModify = () => {
    putOne(board, currentMemberEmail)
      .then((data) => {
        console.log('modify result: ' + data);
        const msg = data.result;
        if (msg === 'fail') {
          alert('다른 사람의 게시글을 수정할 수 없습니다.');
          moveToRead(bno);
        }

        setResult('Modified');
      })
      .catch((err) => {
        console.log(err);
        alert('제목 및 내용을 올바르게 입력해주세요.');
      });
  };

  const handleClickDelete = () => {
    deleteOne(bno, currentMemberEmail).then((data) => {
      console.log('delete result: ', data);
      const msg = data.result;
      if (msg === 'fail') {
        alert('다른 사람의 게시글을 지울 수 없습니다.');
        moveToRead(bno);
      }
      setResult('Deleted');
    });
  };

  //모달 창이 close될 때
  const closeModal = () => {
    if (result === 'Deleted') {
      moveToList();
    } else {
      moveToRead(bno);
    }
  };

  const handleChangeBoard = (e) => {
    board[e.target.name] = e.target.value;
    setBoard({ ...board });
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

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {result ? (
        <ResultModal
          title={'처리결과'}
          content={result}
          callbackFn={closeModal}
        ></ResultModal>
      ) : (
        <></>
      )}

      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-400 hover:bg-blue-800"
          onClick={handleClickCancel}
          hidden={!isModifiable()}
        >
          취소
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500 hover:bg-red-800"
          onClick={handleClickDelete}
          hidden={!isModifiable()}
        >
          삭제
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500 hover:bg-red-800"
          onClick={handleClickModify}
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

      <div className="flex justify-end p-4">
        <div className="mr-4">글번호: {board.bno} </div>
        <div className="mr-4">작성자: {board.writer} </div>
        <div>등록시간: {board.regTime}</div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
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
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">내용</div>
          <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="content"
            type={'text'}
            value={board.content}
            onChange={handleChangeBoard}
            rows="14"
          ></textarea>
          <div className="absolute bottom-0 right-0 text-gray-500">
            {calcContentLen('content')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyComponent;
