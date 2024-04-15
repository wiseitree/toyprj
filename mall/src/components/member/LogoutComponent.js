import useCustomLogin from '../../hooks/useCustomLogin';

const LogoutComponent = () => {
  const { doLogout, moveToPath } = useCustomLogin();

  const handleClickLogout = () => {
    doLogout();
    alert('로그아웃 되었습니다.');
    moveToPath('/');
  };

  return (
    <div className="border-2 border-red-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-red-500">
          로그아웃
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-full max-w-xs flex justify-center font-bold">
            <button
              className="rounded p-4 w-full max-w-xs bg-red-500 hover:bg-red-600 text-xl  text-white"
              onClick={handleClickLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutComponent;
