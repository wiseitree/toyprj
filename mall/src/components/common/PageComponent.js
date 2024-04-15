const PageComponent = ({ serverData, movePage }) => {
  console.log('pageNumList=' + serverData.pageNumList);
  return (
    <div className="m-6 flex justify-center">
      {serverData.prev ? (
        <div
          className="m-2 p-2 w-16 text-center  font-bold text-blue-400 hover:text-blue-800 "
          onClick={() => movePage({ page: serverData.prevPage })}
        >
          Prev{' '}
        </div>
      ) : (
        <></>
      )}

      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum}
          className={`m-2 p-2 w-12  text-center rounded shadow-md text-white ${serverData.current === pageNum ? 'bg-blue-800' : 'bg-blue-400'}
          hover:bg-blue-800 `}
          onClick={() => movePage({ page: pageNum })}
        >
          {pageNum}
        </div>
      ))}

      {serverData.next ? (
        <div
          className="m-2 p-2 w-16 text-center font-bold text-blue-400 hover:text-blue-800"
          onClick={() => movePage({ page: serverData.nextPage })}
        >
          Next
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PageComponent;
