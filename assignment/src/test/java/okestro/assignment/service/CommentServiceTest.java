package okestro.assignment.service;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;
import okestro.assignment.repository.CommentRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class CommentServiceTest {

    @Autowired
    private CommentService commentService;

    @Autowired
    private CommentRepository commentRepository;

    @Test
    public void register() {
        //given
        Long bno = 33L;
        String content = "content update test";
        String email = "user1@aaa.com";
        String nickname = "user1";

        //when
        CommentDTO commentDTO = CommentDTO.builder()
                .bno(bno)
                .content(content)
                .email(email)
                .nickname(nickname)
                .build();

        Long cno = commentService.register(commentDTO);
        Comment comment = commentRepository.findByCno(cno).get();

        //then
        assertThat(comment.getCno()).isEqualTo(cno);
        assertThat(comment.getContent()).isEqualTo(content);
        assertThat(comment.getEmail()).isEqualTo(email);
        assertThat(comment.getNickname()).isEqualTo(nickname);

    }

    @Test
    public void modify(){
        //given
        String currentEmail = "user1@aaa.com";

        Long cno = 43L;
        String content = "content update test";
        String email = "user1@aaa.com";
        LocalDateTime updateTime = LocalDateTime.now();

        CommentDTO commentDTO = CommentDTO.builder()
                .cno(cno)
                .content(content)
                .email(email)
                .updateTime(updateTime)
                .build();

        //when
        commentService.modify(cno, commentDTO, currentEmail);

        //then
        Comment findComment = commentService.getCommentDtl(cno);
        assertThat(findComment.getContent()).isEqualTo(content);

    }

    @Test
    public void remove(){
        //given
        Long cno = 47L;
        String currentEmail = "user1@aaa.com";

        //when
        commentService.remove(cno, currentEmail);

        //then
        Optional<Comment> result = commentRepository.findByCno(cno);
        assertThat(result).isEmpty();

    }

}