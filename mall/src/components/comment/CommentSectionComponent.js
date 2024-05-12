import {useEffect, useState} from "react";
import {getCommentList, postRegisterComment} from "../../api/commentApi";
import CommentAddComponent from "./CommentAddComponent";
import CommentListComponent from "./CommentListComponent";


const CommentSectionComponent = ({bno}) => {
    const [commentList, setCommentList] = useState([]);

    useEffect(() => {
        syncCommentList();
    }, []);

    const syncCommentList = () => {
        getCommentList(bno)
            .then((data) => {
                setCommentList(data);
            })
            .catch((err) => {
                console.log("CommentSectionComponent - getCommentList error = ", err);
            });
    };

    return (
        <div>
            <CommentAddComponent
                bno={bno}
                syncCommentList={syncCommentList}
            ></CommentAddComponent>

            <CommentListComponent
                commentList={commentList}
                syncCommentList={syncCommentList}
            >
            </CommentListComponent>
        </div>
    );

};

export default CommentSectionComponent;