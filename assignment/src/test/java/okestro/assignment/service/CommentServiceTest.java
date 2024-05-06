package okestro.assignment.service;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;
import okestro.assignment.repository.CommentRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

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
        String content = "content test";
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
}