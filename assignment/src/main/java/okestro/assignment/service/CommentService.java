package okestro.assignment.service;

import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;

import java.util.List;
import java.util.Optional;

public interface CommentService {

    Long register(CommentDTO commentDTO);

    Comment getCommentDtl(Long cno);

    List<CommentDTO> getComments(Long cno);
}
