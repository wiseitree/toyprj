package okestro.assignment.repository;

import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface CommentMapper {
    void save(Comment comment);

    Optional<Comment> findByCno(Long cno);

    List<Comment> findCommentList(Long bno);

    void update(@Param("cno") Long cno, @Param("commentDTO") CommentDTO commentDTO);

    void deleteByCno(Long cno);
}
