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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Test
    public void update() {
        //given
        Long cno = 42L;
        Long bno = 137L;
        String content = "commentmapper update test";
        LocalDateTime updateTime = LocalDateTime.now();

        CommentDTO commentDTO = CommentDTO.builder()
                .cno(cno)
                .bno(bno)
                .content(content)
                .updateTime(updateTime)
                .build();

        log.info("commentDTO: {}", commentDTO);


        //when
        commentRepository.update(cno, commentDTO);
        Comment comment = commentRepository.findByCno(cno).get();
        log.info("comment: {}", comment);

        //then
        assertThat(comment.getContent()).isEqualTo(content);

    }

    @Test
    public void deleteByCno(){
        //given
        Long cno = 46L;

        //when
        commentRepository.deleteByCno(cno);

        //then
        Optional<Comment> result = commentRepository.findByCno(cno);
        assertThat(result).isEmpty();

    }

}