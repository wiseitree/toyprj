import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import useCustomLogin from '../../hooks/useCustomLogin';
import {API_SERVER_HOST} from "../../api/boardApi";

const BasicMenu = () => {
    const loginState = useSelector((state) => state.loginSlice);

    return (
        <nav id="navbar" className="flex justify-between items-center p-2 pl-9 pr-9 border-b-gray-300 border-b-2">
            <div className="flex items-center">
                <a href='/'>
                    <img
                        src="https://opening-attachments.greetinghr.com/2023-11-10/8e565850-5989-4a05-96f0-16bd30165e47/Artboard1.png"
                        alt="logo"
                        className="w-44 h-auto"
                    />
                </a>

            </div>

            <div className="w-4/5  ">
                <ul className="flex p-4 text-black font-light">
                    {/*<li className="pr-6 text-2xl hover:text-blue-600">
                        <Link to={'/'}>Main</Link>
                    </li>*/}
                    {/*<li className="pr-6 text-2xl underline hover:underline-offset-8 hover:decoration-4">
            <Link to={'/about'}>About</Link>
          </li>*/}
                    {/*{loginState.email ? (
            <>
              <li className="pr-6 text-2xl underline hover:underline-offset-8 hover:decoration-4">
                <Link to={'/todo/'}>Todo</Link>
              </li>
            </>
          ) : (
            <></>
          )}*/}
                    <li className="pr-6 text-2xl hover:text-blue-600">
                        <Link to={'/board/'}>Board</Link>
                    </li>
                </ul>
            </div>

            <div className="w-1/5 flex justify-end  p-4 text-black font-light">
                {!loginState.email ? (
                    <>
                        <div
                            className=" text-sm m-1 rounded hover:text-blue-600">
                            <Link to={'/member/login'}>로그인</Link>
                        </div>
                        <div
                            className=" text-sm m-1 ml-2 rounded hover:text-blue-600">
                            <Link to={'/member/register'}>회원가입</Link>
                        </div>
                    </>
                ) : (
                    <div
                        className="text-sm m-1 rounded hover:text-blue-600">
                        <Link to={'/member/logout'}>로그아웃</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default BasicMenu;
