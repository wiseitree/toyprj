package okestro.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;
import okestro.assignment.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/comment/")
    public ResponseEntity<?> register(@RequestBody @Valid CommentDTO commentDTO, BindingResult bindingResult) {
        HashMap<String, Long> result = new HashMap<>();
        log.info("CommentDTO = {}", commentDTO);

        if (bindingResult.hasErrors())
            return ResponseEntity.badRequest().body(Map.of("result", "error"));

        Long cno = commentService.register(commentDTO);
        result.put("result", cno);

        return ResponseEntity.ok(result);
    }

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

