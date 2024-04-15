import { useEffect, useState } from 'react';
import useCustomMove from '../../hooks/useCustomMove';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getOne } from '../../api/boardApi';
import { useSelector } from 'react-redux';

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
  const currentMemberEmail = loginState.email;

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

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4 ">
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
