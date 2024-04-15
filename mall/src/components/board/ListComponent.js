import useCustomMove from '../../hooks/useCustomMove';
import { useEffect, useState } from 'react';
import PageComponent from '../common/PageComponent';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getList } from '../../api/boardApi';

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totoalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  const { exceptionHandle } = useCustomLogin();
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();
  //serverData는 나중에 사용
  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    getList({ page, size })
      .then((data) => {
        console.log(data);
        setServerData(data);
      })
      .catch((err) => exceptionHandle(err));
  }, [page, size, refresh]);

  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      <div className="flex mx-auto justify-center p-6 font-extrabold text-2xl">
        <div className="w-1/12">번호</div>
        <div className="w-6/12">제목</div>
        <div className="w-2/12">작성자</div>
        <div className="w-3/12">등록일</div>
      </div>
      <div className="flex flex-wrap mx-auto justify-center p-6">
        {serverData.dtoList.map((board) => (
          <div
            key={board.bno}
            className="w-full min-w-[400px]  p-2 m-2 rounded shadow-md hover:bg-blue-200"
            onClick={() => moveToRead(board.bno)} //이벤트 처리 추가
          >
            <div className="flex ">
              <div className="font-extrabold text-1xl p-2 w-1/12">
                {board.bno}
              </div>
              <div className="text-2xl m-1 p-2 w-6/12 font-extrabold">
                {board.title}
              </div>
              <div className="text-1xl m-1 p-2 w-2/12 font-medium">
                {board.writer}
              </div>
              <div className="text-1xl m-1 p-2 w-3/12 font-medium">
                {board.regTime}
              </div>
            </div>
          </div>
        ))}
      </div>

      <PageComponent
        serverData={serverData}
        movePage={moveToList}
      ></PageComponent>
    </div>
  );
};

export default ListComponent;
