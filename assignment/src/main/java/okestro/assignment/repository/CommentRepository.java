package okestro.assignment.repository;


import lombok.RequiredArgsConstructor;
import okestro.assignment.domain.Comment;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CommentRepository {
    private final CommentMapper commentMapper;

    public Comment save(Comment comment){
        commentMapper.save(comment);
        return comment;
    }

    public Optional<Comment> findByCno(Long cno){
        return commentMapper.findByCno(cno);
    }

    public List<Comment> findCommentList(Long bno){
        return commentMapper.findCommentList(bno);
    }

}
