package okestro.assignment.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;
import okestro.assignment.service.CommentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/api/comment/{cno}")
    public Comment getCommentDtl(@PathVariable Long cno){
        Comment commentDtl = commentService.getCommentDtl(cno);
        return commentDtl;
    }

    @GetMapping("/api/board/{bno}/comments")
    public List<CommentDTO> getComments(@PathVariable Long bno){
        List<CommentDTO> commentDTOList = commentService.getComments(bno);
        return commentDTOList;
    }

}
