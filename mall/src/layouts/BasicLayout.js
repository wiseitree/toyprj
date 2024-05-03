import BasicMenu from '../components/menu/BasicMenu';
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";

const BasicLayout = ({ children }) => {
  return (
    <>
      {/* 기존 헤더 대신 BasicMenu*/}
      <BasicMenu></BasicMenu>

      {/* 상단 여백 my-5 제거 */}
      <div className="my-5 w-full flex flex-col space-y-1 md:flex-row md:space-x-1 md:space-y-0">
          <main className="w-full  px-5 py-5">
              {' '}
              {/* 상단 여백 py-40 변경 flex 제거 */}
              {children}
          </main>

          {/*<aside className="bg-green-300 md:w-1/5 lg:w-1/4 px-5 flex py-5">*/}
          {/*  {' '}*/}
          {/*  /!* 상단 여백 py-40 제거 flex 제거 *!/*/}
          {/*  <h1 className="text-2xl md:text-4xl">Sidebar</h1>*/}
          {/*</aside>*/}
      </div>
    </>
  );
};

export default BasicLayout;
