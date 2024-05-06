package okestro.assignment.repository;

import okestro.assignment.domain.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CommentMapper {
    void save(Comment comment);

    Optional<Comment> findByCno(Long cno);

    List<Comment> findCommentList(Long bno);
}
