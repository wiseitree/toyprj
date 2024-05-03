import { useParams } from 'react-router-dom';
import ReadComponent from '../../components/board/ReadComponent';

const ReadPage = () => {
  const { bno } = useParams();

  return (
    <div className="p-4 pt-0 w-full bg-white">
      <div className="text-3xl font-extrabold ml-2">게시판 상세</div>
      <ReadComponent bno={bno}></ReadComponent>
    </div>
  );
};

export default ReadPage;
