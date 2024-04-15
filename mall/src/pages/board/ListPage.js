import ListComponent from '../../components/board/ListComponent';

const ListPage = () => {
  return (
    <div className="p-4 w-full bg-white">
      <div className="text-3xl font-extrabold">목록</div>
      <ListComponent />
    </div>
  );
};

export default ListPage;
