import {Outlet, useNavigate} from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import {useCallback} from 'react';

const IndexPage = () => {
    const navigate = useNavigate();

    const handleClickAdd = useCallback(() => {
        navigate({pathname: 'add'});
    });

    return (
        <BasicLayout>
            <div className="flex justify-end w-full p-4 pb-0 ">
                <button
                    type={'button'}
                    className="rounded text-xl mr-6 p-4 w-32  text-white bg-blue-500 hover:bg-blue-800"
                    onClick={handleClickAdd}
                >
                    글 작성
                </button>
            </div>
            <div className="flex flex-wrap w-full">
                <Outlet/>
            </div>
        </BasicLayout>
    );
};

export default IndexPage;
