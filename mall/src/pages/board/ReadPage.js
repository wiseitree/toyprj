import { useParams } from 'react-router-dom';
import ReadComponent from '../../components/board/ReadComponent';

const ReadPage = () => {
  const { bno } = useParams();

  return (
    <div className=" w-full bg-white mt-6">
      <div className="text-3xl font-extrabold">게시판 상세</div>
      <ReadComponent bno={bno}></ReadComponent>
    </div>
  );
};

export default ReadPage;
