import {useState} from "react";
import CommentModifyComponent from "./CommentModifyComponent";
import CommentComponent from "./CommentComponent";

const CommentListComponent = ({commentList}) => {
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

    const handleClickCancel = () => {
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
                        >
                        </CommentComponent>
                        :
                        <CommentModifyComponent
                            commentList={commentList}
                            comment={comment}
                            handleClickCancel={handleClickCancel}
                        >
                        </CommentModifyComponent>
                    }
                </div>
            ))}
        </ul>
    );

};

export default CommentListComponent;
