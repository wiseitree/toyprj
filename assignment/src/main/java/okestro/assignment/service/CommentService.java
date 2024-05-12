package okestro.assignment.service;

import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;

import java.util.List;

public interface CommentService {

    Long register(CommentDTO commentDTO);

    Comment getCommentDtl(Long cno);

    List<CommentDTO> getComments(Long cno);

    void modify(Long cno, CommentDTO commentDTO, String currentEmail);

    void remove(Long cno, String currentEmail);
}
