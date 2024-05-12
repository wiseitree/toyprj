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
        Long cno = 0L;

        log.info("CommentDTO = {}", commentDTO);

        if (bindingResult.hasErrors())
            return ResponseEntity.badRequest().body(Map.of("result", "error"));

        try {
            cno = commentService.register(commentDTO);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("result", e.getMessage()));
        }

        result.put("result", cno);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/comment/{cno}")
    public Comment getCommentDtl(@PathVariable Long cno) {
        Comment commentDtl = commentService.getCommentDtl(cno);
        return commentDtl;
    }

    @GetMapping("/api/board/{bno}/comments")
    public List<CommentDTO> getComments(@PathVariable Long bno) {
        List<CommentDTO> commentDTOList = commentService.getComments(bno);
        return commentDTOList;
    }

    @PutMapping("/api/comment/{cno}")
    public ResponseEntity<?> modify(@PathVariable Long cno, @RequestBody @Valid CommentDTO commentDTO, BindingResult bindingResult, @RequestHeader("CurrentData") String currentEmail) {
        Map<String, String> result = new HashMap<>();

        if (bindingResult.hasErrors()) {
            result.put("result", "error");
            return ResponseEntity.badRequest().body(result);
        }

        try {
            commentService.modify(cno, commentDTO, currentEmail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("result", e.getMessage()));
        }


        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/api/comment/{cno}")
    public ResponseEntity<?> remove(@PathVariable Long cno, @RequestHeader("CurrentData") String currentEmail) {
        Map<String, String> result = new HashMap<>();

        try {
            commentService.remove(cno, currentEmail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("result", e.getMessage()));
        }

        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }

}

