package okestro.assignment.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.domain.Comment;
import okestro.assignment.dto.CommentDTO;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.*;


@SpringBootTest
@Slf4j
class CommentRepositoryTest {

    @Autowired
    private CommentRepository commentRepository;


    @Test
    public void save(){
        //given
        Long bno = 33L;
        String content = "content test";
        String email = "user1@aaa.com";
        String nickname = "user1";

        Comment comment = Comment.builder()
                .bno(bno)
                .content(content)
                .email(email)
                .nickname(nickname)
                .build();

        log.info("comment: {}", comment);


        //when
        Comment savedComment = commentRepository.save(comment);

        //then
        assertThat(savedComment.getBno()).isEqualTo(bno);

    }

    @Test
    public void findByCno() {
        //given
        Long cno = 2L;

        //when
        Comment comment = commentRepository.findByCno(cno)
                .get();

        //then
        assertThat(comment.getCno()).isEqualTo(cno);

    }

    @Test
    public void findCommentList(){
        //given
        Long bno = 33L;

        //when
        List<Comment> commentList = commentRepository.findCommentList(bno);


        //then
        log.info("commentList: {}", commentList);

    }

}