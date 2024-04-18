import { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomLogin from '../../hooks/useCustomLogin';
import { deleteOne, getOne } from '../../api/boardApi';
import { useSelector } from 'react-redux';
import ResultModal from '../common/ResultModal';

const initState = {
  bno: 0,
  title: '',
  content: '',
  writer: '',
  regTime: null,
  updateTime: null,
  email: '',
};

const ReadComponent = ({ bno }) => {
  const loginState = useSelector((state) => state.loginSlice);
  const { exceptionHandle } = useCustomLogin();
  const [board, setBoard] = useState(initState);
  const [boardOwnerEmail, setBoardOwnerEmail] = useState('');
  const { moveToList, moveToModify } = useCustomMove();
  const [result, setResult] = useState(null);
  const currentMemberEmail = loginState.email;
  const role = loginState.roleNames;

  const isAdmin = () => {
    let admin = false;
    if (role.includes('ADMIN')) admin = true;

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
    getOne(bno)
      .then((data) => {
        setBoard(data);
        setBoardOwnerEmail(data.email);
      })
      .catch((err) => exceptionHandle(err));
  }, [bno]);

  const handleClickDelete = () => {
    deleteOne(bno, currentMemberEmail).then((data) => {
      setResult('Deleted');
    });
  };

  //모달 창이 close될 때
  const closeModal = () => {
    if (result === 'Deleted') moveToList();
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4 ">
      {result ? (
        <ResultModal
          title={'처리결과'}
          content={result}
          callbackFn={closeModal}
        ></ResultModal>
      ) : (
        <></>
      )}

      {/* buttons..........start */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500 hover:bg-blue-800"
          onClick={() => moveToList()}
        >
          목록
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500 hover:bg-blue-800"
          onClick={() => moveToModify(bno)}
          hidden={!isModifiable()}
        >
          수정
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500 hover:bg-red-800"
          onClick={handleClickDelete}
          hidden={!isAdmin()}
        >
          삭제
        </button>
      </div>

      {/* 글 정보 */}
      <div className="flex justify-end p-4">
        <div className="mr-4">글번호: {board.bno} </div>
        <div className="mr-4">작성자: {board.writer} </div>
        <div>등록시간: {board.regTime}</div>
      </div>

      {/*{makeDiv('번호', board.bno)}*/}
      {/*{makeDiv('제목', board.title)}*/}

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">제목</div>
          <div className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md">
            {board.title}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">내용</div>
          <textarea
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            rows="14"
            value={board.content}
            readOnly={true}
          ></textarea>
        </div>
      </div>
      {/*{makeDiv('내용', board.content)}*/}
      {/*{makeDiv('작성자', board.writer)}*/}
      {/*{makeDiv('등록시간', board.regTime)}*/}
      {/*{makeDiv('수정시간', board.updateTime)}*/}
    </div>
  );
};

const makeDiv = (title, value) => (
  <div className="flex justify-center">
    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
      <div className="w-1/5 p-6 text-right font-bold">{title}</div>
      <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
        {value}
      </div>
    </div>
  </div>
);

export default ReadComponent;
