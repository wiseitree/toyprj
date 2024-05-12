import {useState} from "react";
import CommentModifyComponent from "./CommentModifyComponent";
import CommentComponent from "./CommentComponent";

const CommentListComponent = ({commentList, syncCommentList}) => {
    const [modifyCommentIndex, setModifyCommentIndex] = useState('');

    const isModifyClicked = (index) => {
        let modifyClicked = false;

        if (modifyCommentIndex === index)
            modifyClicked = true;

        return modifyClicked;
    };


    const handleClickModify = (index) => {
        setModifyCommentIndex(index);
    };

    const initModifyCommentIndex = () => {
        setModifyCommentIndex('');
    }


    return (
        <ul className="mt-14">
            {commentList.map((comment, index) => (
                <div>
                    {!isModifyClicked(index) ?
                        <CommentComponent
                            comment={comment}
                            index={index}
                            handleClickModify={handleClickModify}
                            syncCommentList={syncCommentList}
                        >
                        </CommentComponent>
                        :
                        <CommentModifyComponent
                            comment={comment}
                            initModifyCommentIndex={initModifyCommentIndex}
                            syncCommentList={syncCommentList}
                        >
                        </CommentModifyComponent>
                    }
                </div>
            ))}
        </ul>
    );

};

export default CommentListComponent;

