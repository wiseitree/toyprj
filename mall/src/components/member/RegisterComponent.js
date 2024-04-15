import { useEffect, useState } from 'react';
import { checkDuplicate, postRegister } from '../../api/memberApi';
import useCustomLogin from '../../hooks/useCustomLogin';

const registerState = {
  email: '',
  pw: '',
  nickname: '',
};

const loginState = {
  email: '',
  pw: '',
};

const RegisterComponent = () => {
  const [registerParam, setRegisterParam] = useState({ ...registerState });
  const [loginParam, setLoginParam] = useState({ ...loginState });
  const [confirm, setConfirm] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isPwChecked, setIsPwChecked] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const { doLogin, moveToPath } = useCustomLogin();

  useEffect(() => {
    if (isEmailChecked && isPwChecked && isNicknameChecked) {
      setIsAllChecked(true);
    }
  }, [isEmailChecked, isPwChecked, isNicknameChecked]);

  const handleChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    registerParam[targetName] = targetValue;
    setRegisterParam({ ...registerParam });

    loginParam[targetName] = targetValue;
    setLoginParam({ ...loginParam });

    setIsAllChecked(false);

    if (targetName === 'email') {
      setIsEmailChecked(false);
    }

    if (targetName === 'nickname') {
      setIsNicknameChecked(false);
    }
  };

  const isValidEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let isValid = false;
    if (emailRegex.test(registerParam.email)) {
      isValid = true;
    }

    return isValid;
  };

  const isValidPw = () => {
    const pwRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}$/;
    let isValid = false;
    if (pwRegex.test(registerParam.pw)) {
      isValid = true;
    }

    return isValid;
  };

  const isValidPwStr = () => {
    const hasLowerCase = /[a-z]/.test(registerParam.pw);
    const hasUpperCase = /[A-Z]/.test(registerParam.pw);
    let isValid = false;

    if (hasLowerCase || hasUpperCase) isValid = true;

    return isValid;
  };

  const isValidPwNum = () => {
    const hasNumber = /[0-9]/.test(registerParam.pw);
    let isValid = false;

    if (hasNumber) isValid = true;

    return isValid;
  };

  const isValidPwUniq = () => {
    const hasUniq = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      registerParam.pw,
    );
    let isValid = false;

    if (hasUniq) isValid = true;

    return isValid;
  };

  const isValidPwLen = () => {
    let isValid = false;

    if (8 <= registerParam.pw.length && registerParam.pw.length <= 16)
      isValid = true;

    return isValid;
  };

  const isValidNickname = () => {
    const nicknameRegex = /^[ㄱ-ㅎ가-힣a-z0-9-_]{4,12}$/;

    let isValid = false;

    // if (nickname === '' || nickname.includes(' ')) result = false;
    if (nicknameRegex.test(registerParam.nickname)) {
      isValid = true;
    }

    return isValid;
  };

  const handleEmail = () => {
    let result = true;

    if (isValidEmail() && !isEmailChecked) result = false;

    return result;
  };

  const handleNickname = () => {
    let result = true;

    if (isValidNickname() && !isNicknameChecked) result = false;

    return result;
  };

  const handleConfirm = (e) => {
    setIsPwChecked(false);
    const confirmValue = e.target.value;
    setConfirm(confirmValue);

    const pw = registerParam.pw;

    if (confirmValue === pw) {
      setIsPwChecked(true);
    }

    setIsAllChecked(false);
  };

  const renderStatusText = (state) => {
    let validStatus = true;
    let validStatusText = <></>;

    if (state === 'email' && isValidEmail())
      validStatusText = '올바른 이메일 형식입니다.';

    if (state === 'email' && isValidEmail() && isEmailChecked)
      validStatusText = <>&#10003; 사용하실 수 있는 이메일입니다.</>;

    if (state === 'email' && !isValidEmail()) {
      validStatus = false;
      validStatusText = '이메일 형식이 올바르지 않습니다.';
    }

    if (state === 'blank') {
      validStatus = false;
      validStatusText = <>비밀번호에 공백 문자가 포함되어 있습니다.</>;
    }

    if (state === 'pwStr' && isValidPwStr())
      validStatusText = <>&#10003; 영문 대,소문자</>;

    if (state === 'pwStr' && !isValidPwStr()) {
      validStatus = false;
      validStatusText = <>&#10003; 영문 대,소문자</>;
    }

    if (state === 'pwNum' && isValidPwNum())
      validStatusText = <>&#10003; 숫자</>;

    if (state === 'pwNum' && !isValidPwNum()) {
      validStatus = false;
      validStatusText = <>&#10003; 숫자</>;
    }

    if (state === 'pwUnq' && isValidPwUniq())
      validStatusText = <>&#10003; 특수문자</>;

    if (state === 'pwUnq' && !isValidPwUniq()) {
      validStatus = false;
      validStatusText = <>&#10003; 특수문자</>;
    }

    if (state === 'pwLen' && isValidPwLen())
      validStatusText = <>&#10003; 글자 수</>;

    if (state === 'pwLen' && !isValidPwLen()) {
      validStatus = false;
      validStatusText = <>&#10003; 글자 수</>;
    }

    if (state === 'pwBlank') {
      validStatus = false;
      validStatusText = <>비밀번호를 다시 입력해주세요.</>;
    }

    if (state === 'pwConfirm' && confirm === registerParam.pw) {
      validStatusText = <>&#10003; 비밀번호가 일치합니다.</>;
    }
    if (state === 'pwConfirm' && confirm !== registerParam.pw) {
      validStatus = false;
      validStatusText = '비밀번호가 일치하지 않습니다.';
    }

    if (state === 'nickname' && isValidNickname())
      validStatusText = '유효한 값을 입력하였습니다.';

    if (state === 'nickname' && isValidNickname() && isNicknameChecked)
      validStatusText = <>&#10003; 사용하실 수 있는 닉네임입니다.</>;

    if (state === 'nickname' && !isValidNickname()) {
      validStatus = false;
      validStatusText = '입력값이 유효하지 않습니다.';
    }

    return (
      <span className={validStatus ? 'text-green-500' : 'text-red-500'}>
        {validStatusText}
      </span>
    );
  };

  const handleDuplicateButton = (checked) => {
    if (checked) return 'cursor-not-allowed opacity-50';
    return '';
  };

  const handleCheckDuplicate = (data) => {
    const prefix = data === 'email' ? 'email' : 'nickname';

    checkDuplicate(prefix + ':' + registerParam[data]).then((r) => {
      const msg = r.result;
      if (msg === 'isNotDuplicated') {
        alert('사용하실 수 있습니다.');
        if (data === 'email') setIsEmailChecked(true);
        if (data === 'nickname') setIsNicknameChecked(true);
      }
      if (msg === 'isDuplicated') {
        alert('이미 사용중입니다.');
      }
    });
  };

  const handleKeyDown = (e) => {
    if (isAllChecked && e.key === 'Enter') handleClickRegister();
  };

  const handleClickRegister = () => {
    console.log(
      '##########RegisterComponent handleClickRegister postRegister##########',
    );
    postRegister(registerParam)
      .then((r) => {
        console.log('########## result ##########');
        console.log(r);
        console.log('########## result ##########');

        alert('회원가입 성공');
        doLogin(loginParam);
        moveToPath('/');

        /*회원 등록 실패 처리*/
      })
      .catch((err) => {
        console.log('error');
      });
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4 w-1/2 ">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          회원 가입
        </div>
      </div>
      {/* 이메일 입력 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">이메일</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email"
            type={'text'}
            value={registerParam.email}
            onChange={handleChange}
            placeholder="user@aaa.com"
            autoFocus={true}
          ></input>
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-4 absolute left-20 top-0 mt-1 mr-1 rounded ${handleEmail() ? '' : 'hover:bg-blue-800'}
            ${handleEmail() ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => handleCheckDuplicate('email')}
            type="button"
            disabled={handleEmail()}
          >
            중복확인
          </button>
        </div>
      </div>

      {/*이메일 입력값 유효 체크 메시지*/}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left">
            {registerParam.email === '' ? (
              <></>
            ) : (
              <>{renderStatusText('email')}</>
            )}
          </div>
        </div>
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">비밀번호</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type={'password'}
            value={registerParam.pw}
            onChange={handleChange}
            placeholder="영문 대,소문자와 숫자 그리고 특수기호는 적어도 1개 이상 포함된 8자 ~ 16자의 비밀번호여야 합니다."
          ></input>
        </div>
      </div>

      {/*비밀번호 유효성 체크 메시지*/}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left">
            {registerParam.pw.includes(' ') ? (
              <>{renderStatusText('blank')}</>
            ) : (
              <>
                {registerParam.pw === '' ? (
                  <></>
                ) : (
                  <>{renderStatusText('pwStr')}</>
                )}
                {registerParam.pw === '' ? (
                  <></>
                ) : (
                  <>{renderStatusText('pwNum')}</>
                )}
                {registerParam.pw === '' ? (
                  <></>
                ) : (
                  <>{renderStatusText('pwUnq')}</>
                )}
                {registerParam.pw === '' ? (
                  <></>
                ) : (
                  <>{renderStatusText('pwLen')}</>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">비밀번호 확인</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type={'password'}
            value={confirm}
            onChange={handleConfirm}
            placeholder={
              !isValidPw()
                ? '올바른 비밀번호를 입력하셔야 비밀번호 확인이 가능합니다.'
                : ''
            }
            disabled={!isValidPw()}
          ></input>
        </div>
      </div>

      {/*비밀번호 일치 여부 메시지*/}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left">
            {registerParam.pw.includes(' ') ? (
              <>{renderStatusText('pwBlank')}</>
            ) : (
              <>
                {confirm === '' ? <></> : <>{renderStatusText('pwConfirm')}</>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 닉네임 입력 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">닉네임</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="nickname"
            type={'text'}
            value={registerParam.nickname}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="닉네임은 특수문자 제외 4자 이상 12자 이하여야 합니다. "
          ></input>
          <button
            className={`bg-blue-500 text-white font-bold py-2 px-4 absolute left-20 top-0 mt-1 mr-1 rounded ${handleNickname() ? '' : 'hover:bg-blue-800'}
            ${handleNickname() ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => handleCheckDuplicate('nickname')}
            type="button"
            disabled={handleNickname()}
          >
            중복확인
          </button>
        </div>
      </div>

      {/*닉네임 입력값 유효 체크 메시지*/}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left">
            {registerParam.nickname === '' ? (
              <></>
            ) : (
              <>{renderStatusText('nickname')}</>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className={`rounded p-4 w-36 bg-blue-500 text-xl  text-white ${!isAllChecked ? '' : 'hover:bg-blue-800'} 
              ${!isAllChecked ? 'cursor-not-allowed opacity-50' : ''}`}
              type="button"
              onClick={handleClickRegister}
              disabled={!isAllChecked}
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
