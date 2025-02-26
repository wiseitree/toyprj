package okestro.assignment.repository.mybatis;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.domain.Member;
import okestro.assignment.domain.Todo;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.repository.BoardRepository;
import okestro.assignment.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Slf4j
class BoardRepositoryTest {

    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private MemberRepository memberRepository;

    @Test
    public void createDummy() {
        String email = "user1@aaa.com";

        for (int i = 1; i <= 135; i++) {
            Member member = memberRepository.findByEmail(email).get();
            Board board = Board.builder()
                    .title("user1 title")
                    .content("user1 content")
                    .member(member)
                    .build();

            Board savedBoard = boardRepository.save(board);
        }

    }

    @Test
    public void insert(){
        //given
        String email = "usertest@aaa.com";

        //when
        Member member = memberRepository.findByEmail(email).get();
        Board board = Board.builder()
                .title("titleTest")
                .content("contentTest")
                .member(member)
                .build();

        Board savedBoard = boardRepository.save(board);

        //then
        assertThat(savedBoard.getMember().getEmail()).isEqualTo(email);

    }

    @Test
    public void read() {
        //given
        Long bno = 3L;

        //when
        Board board = boardRepository.findByBno(bno).get();

        //then
//        assertThat(board.getWriter()).isEqualTo(board.getMember().getNickname());

        //log
        log.info("board = {}", board);
        log.info("board.getMember = {}", board.getMember());

    }

    @Test
    public void update() {
        //given
        Long bno = 5L;

        String email = "usertest@aaa.com";
        String writer = "testuser";
        String title = "update title";
        String content = "update content";
//        String updateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        LocalDateTime regTime = LocalDateTime.now();
        LocalDateTime updateTime = LocalDateTime.now();

        BoardDTO boardDTO = BoardDTO.builder()
                .writer(writer)
                .title(title)
                .content(content)
                .email(email)
                .regTime(regTime)
                .updateTime(updateTime)
                .build();

        log.info("#################### BoardDTO = {}", boardDTO);

        //when
        boardRepository.update(bno, boardDTO);


        //then
        Board board = boardRepository.findByBno(bno).get();
        log.info("#################### board = {}", board);

    }

    @Test
    public void delete() {
        //given
        Long bno = 2L;

        //when
        boardRepository.deleteByBno(bno);
        Optional<Board> result = boardRepository.findByBno(bno);

        //then
        assertThat(result).isEmpty();

    }

    @Test
    public void findBoardList() {
        //given
        int offset = 10;
        int limit = 20;

        //when
        List<Board> boardList = boardRepository.findBoardList(offset, limit);
        List<BoardDTO> boardDTOList = new ArrayList<>();


        for (Board board : boardList) {
            BoardDTO boardDTO = board.toDTO(board);
            boardDTOList.add(boardDTO);
        }

        //then
        log.info("#################### BoardRepositoryTest - findBoardList ##############################");
        for (BoardDTO boardDTO : boardDTOList) {
            log.info("boardDTO = {} ", boardDTO);
        }
        log.info("#################### BoardRepositoryTest - findBoardList ##############################");

        int totalCount = boardRepository.getTotalCount();
        log.info("#################### totalCount = {}", totalCount);

    }

}