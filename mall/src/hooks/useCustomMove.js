import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useState } from 'react';

const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }

  return parseInt(param);
};

const getStr = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }

  return param;
};

const useCustomMove = () => {

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const [queryParams] = useSearchParams();

  const page = getNum(queryParams.get('page'), 1);
  const size = getNum(queryParams.get('size'), 10);
  const title = getStr(queryParams.get('title'), '');
  const content = getStr(queryParams.get('content'), '');
  const keyword = getStr(queryParams.get('keyword'), '');

  const queryDefault = createSearchParams({ page, size }).toString();
  const searchDefault = createSearchParams({ title, content, keyword });


  const moveToList = (pageParam, searchParam) => {
    let queryStr = '';
    let searchStr = '';

    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);

      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    if (searchParam) {
      const titleStr = getStr(searchParam.title, '');
      const contentStr = getStr(searchParam.content, '');
      const keywordStr = getStr(searchParam.keyword, '');
      console.log(
        '############################################################ moveToList - searchParam start',
      );
      console.log('now searchParam = ', searchParam);

      console.log(
        '############################################################ moveToList - searchParam end',
      );

      searchStr = createSearchParams({
        title: titleStr,
        content: contentStr,
        keyword: keywordStr,
      });
    } else {
      searchStr = searchDefault;
      console.log(
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX searchParam is null XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      );
    }

    navigate({
      pathname: `../list`,
      search: `${queryStr}&${searchStr}`,
    });
    setRefresh(!refresh);
  };

  const moveToModify = (num) => {
    navigate({
      pathname: `../modify/${num}`,
      search: `${queryDefault}&${searchDefault}`,
    });
  };

  const moveToRead = (num) => {
    navigate({
      pathname: `../read/${num}`,
      search: `${queryDefault}&${searchDefault}`,
    });
  };

  return {
    moveToList,
    moveToModify,
    moveToRead,
    page,
    size,
    title,
    content,
    keyword,
    refresh,
    searchDefault,
  };
};

export default useCustomMove;
