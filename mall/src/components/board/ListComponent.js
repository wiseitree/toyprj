import useCustomMove from '../../hooks/useCustomMove';
import { useEffect, useState } from 'react';
import PageComponent from '../common/PageComponent';
import useCustomLogin from '../../hooks/useCustomLogin';
import { getList } from '../../api/boardApi';
import FetchingModal from "../common/FetchingModal";

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

const searchState = {
  title: '',
  content: '',
  keyword: '',
};

const ListComponent = () => {
  console.log('##### ListComponent start #####');
  const { exceptionHandle } = useCustomLogin();
  const {
    page,
    size,
    title,
    content,
    keyword,
    refresh,
    moveToList,
    moveToRead,
  } = useCustomMove();
  //serverData는 나중에 사용
  const [serverData, setServerData] = useState(initState);
  const [searchParam, setSearchParam] = useState(searchState);
  const [fetching, setFetching] = useState(false);

  console.log('currentSearchParam.title - ' + searchParam.title);
  console.log('currentSearchParam.content - ' + searchParam.content);
  console.log('currentSearchParam.keyword - ' + searchParam.keyword);
  console.log('current-title = ' + title);
  console.log('current-content = ' + content);
  console.log('current-keyword = ' + keyword);
  console.log('##### ListComponent end #####');

  useEffect(() => {
    setFetching(true);
    console.log("#################################### useEffect before getList ####################################");
    getList({page, size}, {title, content, keyword})
        .then((data) => {
          setServerData(data);
          console.log("current serverdata = ", data);
          setFetching(false);
        })
        .catch((err) =>{
            console.log("#################################### useEffect err ####################################");
          exceptionHandle(err)});
  }, [page, size, title, content, keyword, refresh]);

  useEffect(() => {
    searchParam.title = title;
    searchParam.content = content;
    searchParam.keyword = keyword;

    if (searchParam.title === '' && searchParam.content === '') {
      searchParam.title = 'title';
      searchParam.content = 'content';
      // setSearchParam({ ...searchParam, title: 'title', content: 'content' }); <-- 얘는 위에 두줄 주석처리하면 써도 됌
      console.log(
        "##### if searchParam.title == '' && searchParam.content == ''",
      );
    }

    // setSearchParam({ ...searchParam, title, content, keyword }); <-- 여기서 이렇게 쓰면 안돼고
    // setSearchParam({ ...searchParam, title: 'title', content: 'content' }); <-- 얘도 이렇게 쓰면 안돼고
  }, [title, content, keyword]);

  const handleSearchOptionChange = (e) => {
    searchParam.title = '';
    searchParam.content = '';

    if (e.target.value === 'title') searchParam.title = 'title';

    if (e.target.value === 'content') searchParam.content = 'content';

    if (e.target.value === 'titleAndContent') {
      searchParam.title = 'title';
      searchParam.content = 'content';
    }

    setSearchParam({ ...searchParam });
  };

  const handleSearchKeywordChange = (e) => {
    searchParam.keyword = e.target.value;
    console.log('handleSearchKeywordChange - searchParam', searchParam);
    setSearchParam({ ...searchParam });
  };

  const searchParamOption = () => {
    let option = 'titleAndContent';
    if (searchParam.title === 'title') option = 'title';

    if (searchParam.content === 'content') option = 'content';

    if (searchParam.title === 'title' && searchParam.content === 'content')
      option = 'titleAndContent';

    return option;
  };

  const searchParamKeyword = () => {
    return searchParam.keyword;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      moveToList({ page: 1, size: 10 }, searchParam);
    }
  };

  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      {fetching ? <FetchingModal/> : <></>}
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
              <div className="flex items-center text-2xl m-1 p-2 w-6/12 font-extrabold">
                {board.title} {board.uploadFileNames.length > 0 ?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" className="w-6 h-6 ml-2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"/>
                    </svg>
                    :
                    <></>
                    }
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

      <div className="flex mx-auto justify-center p-6">
        <div className="w-full flex justify-center">
          <select
            className="border border-gray-300 rounded-md p-1 hover:underline"
            onChange={handleSearchOptionChange}
            value={searchParamOption()}
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="titleAndContent">제목+내용</option>
          </select>
          <input
            className="border border-gray-300 rounded-md p-1 ml-2"
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchParamKeyword()}
            onChange={handleSearchKeywordChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 text-white p-1 ml-2 rounded-md hover:bg-blue-600"
            onClick={() => moveToList({ page: 1, size: 10 }, searchParam)}
          >
            검색
          </button>
        </div>
      </div>

      <PageComponent
        serverData={serverData}
        // searchOption={searchOption}
        // searchKeyword={searchKeyword}
        movePage={moveToList}
      ></PageComponent>
    </div>
  );
};

export default ListComponent;
