import useCustomMove from '../../hooks/useCustomMove';

const ResultModal = ({ title, content, handleModal }) => {
  const { moveToList, moveToRead } = useCustomMove();
  const {
    bno,
    board,
    currentMemberEmail,
    handleClickCancel,
    handleClickDelete,
    handleClickModify,
    handleClickAdd,
    handleClickAddCancel,
  } = handleModal;

  console.log('handleClickCancel = ', handleClickCancel);
  console.log('handleClickDelete = ', handleClickDelete);
  console.log('handleClickModify = ', handleClickModify);
  const handleClickType = (title) => {
    if (title === '삭제') handleClickDelete(bno, currentMemberEmail);

    if (title === '수정') handleClickModify(board, currentMemberEmail);

    if (title === '등록') handleClickAdd(board);

    if (title === '작성 취소') handleClickAddCancel();
  };

  return (
    <div
      className={`fixed top-0 left-0 z-[1055] flex h-full w-full  justify-center bg-black bg-opacity-20`}
      // onClick={() => {
      //   if (callbackFn) {
      //     callbackFn();
      //   }
      // }}
    >
      <div className="absolute bg-white shadow dark:bg-gray-700 opacity-100 w-1/4 rounded  mt-10 mb-10 px-6 min-w-[600px]">
        <div className="justify-center bg-warning-400 mt-6 mb-6 text-2xl border-b-4 border-gray-500">
          {title}
        </div>
        <div className="text-4xl  border-orange-400 border-b-4 pt-4 pb-4">
          {content}
        </div>
        <div className="justify-end flex ">
          <button
            className="rounded bg-gray-400 hover:bg-gray-500 mt-4 mr-2 mb-4 px-6 pt-4 pb-4 text-lg text-white"
            onClick={() => handleClickCancel(bno)}
          >
            취소
          </button>
          <button
            className="rounded bg-blue-500 hover:bg-blue-800 mt-4 mb-4 px-6 pt-4 pb-4 text-lg text-white"
            onClick={() => {
              handleClickType(title);
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
