import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, loginPostAsync } from '../../slices/loginSlice';
import { useNavigate } from 'react-router-dom';
import useCustomLogin from '../../hooks/useCustomLogin';

const initState = {
  email: '',
  pw: '',
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });

  /*const navigate = useNavigate();

  const dispatch = useDispatch();*/

  const { doLogin, moveToPath } = useCustomLogin();

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;

    setLoginParam({ ...loginParam });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleClickLogin();
  };

  const handleClickLogin = (e) => {
    // dispatch(login(loginParam)); 동기화된 호출
    // 비동기 호출
    doLogin(loginParam) // loginSlice의 비동기 호출
      .then((data) => {
        console.log('##########LoginComponent doLogin ##########');
        console.log('########## doLogin ##########');
        console.log(data);
        console.log('####################');
        console.log(data.email);
        console.log('####################');
        console.log('########## doLogin ##########');
        console.log('##########LoginComponent doLogin ##########');
        if (data.error) {
          alert('이메일과 비밀번호를 다시 확인하세요.');
        } else {
          alert('로그인 성공');
          moveToPath('/');
        }
      });
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4 ">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          로그인
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">이메일</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email"
            type={'text'}
            value={loginParam.email}
            onChange={handleChange}
            autoFocus={true}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">비밀번호</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type={'password'}
            value={loginParam.pw}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-full max-w-xs flex justify-center font-bold">
            <button
              className="rounded p-4 w-36  bg-blue-500 hover:bg-blue-600 text-xl  text-white"
              onClick={handleClickLogin}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
