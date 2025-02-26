import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useCustomLogin from '../../hooks/useCustomLogin';

const BasicMenu = () => {
  const loginState = useSelector((state) => state.loginSlice);

  return (
    <nav id="navbar" className=" flex  bg-blue-300">
      <div className="w-4/5 bg-gray-500 ">
        <ul className="flex p-4 text-white font-bold ">
          <li className="pr-6 text-2xl underline hover:underline-offset-8 hover:decoration-4">
            <Link to={'/'}>Main</Link>
          </li>
          <li className="pr-6 text-2xl underline hover:underline-offset-8 hover:decoration-4">
            <Link to={'/about'}>About</Link>
          </li>
          {loginState.email ? (
            <>
              <li className="pr-6 text-2xl underline hover:underline-offset-8 hover:decoration-4">
                <Link to={'/todo/'}>Todo</Link>
              </li>
            </>
          ) : (
            <></>
          )}
          {loginState.email ? (
            <>
              <li className="pr-6 text-2xl underline hover:underline-offset-8 hover:decoration-4">
                <Link to={'/board/'}>Board</Link>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>

      <div className="w-1/5 flex justify-end bg-orange-300 p-4 font-medium">
        {!loginState.email ? (
          <>
            <div className="text-white text-sm m-1 rounded underline hover:underline-offset-8 hover:decoration-4">
              <Link to={'/member/login'}>로그인</Link>
            </div>
            <div className="text-white text-sm m-1 rounded underline hover:underline-offset-8 hover:decoration-4">
              <Link to={'/member/register'}>회원가입</Link>
            </div>
          </>
        ) : (
          <div className="text-white text-sm m-1 rounded underline hover:underline-offset-8 hover:decoration-4">
            <Link to={'/member/logout'}>로그아웃</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BasicMenu;
