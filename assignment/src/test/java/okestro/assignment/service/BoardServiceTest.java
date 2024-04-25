package okestro.assignment.service;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.repository.BoardRepository;
import okestro.assignment.repository.MemberRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class BoardServiceTest {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private BoardService boardService;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    public void register() throws Exception {
        //given
        String title = "title register";
        String content = "content register";
        String email = "user1@aaa.com";
        String writer = "user1";

        BoardDTO boardDTO = BoardDTO.builder()
                .title(title)
                .content(content)
                .email(email)
                .writer(writer)
                .build();

        boardDTO.setUploadFileNames(
                List.of(
                        UUID.randomUUID() + "_" + "Test1.jpg",
                        UUID.randomUUID() + "_" + "Test2.jpg"
                )
        );

        //when
        Long bno = boardService.register(boardDTO);

        Board savedBoard = boardRepository.findByBno(bno).get();

        //then
        assertThat(savedBoard.getTitle()).isEqualTo("title register");
        assertThat(savedBoard.getMember().getEmail()).isEqualTo("user1@aaa.com");
        log.info("############################## savedBoard = {}", savedBoard);
        log.info("############################## savedBoard.getMember = {}", savedBoard.getMember());

    }

    @Test
    public void getBoardDtl() {
        //given
        Long bno = 153L;

        //when
        BoardDTO boardDTO = boardService.getBoardDtl(bno);

        //then
        log.info("##############################boardDTO = {}" , boardDTO);
        Board board = boardRepository.findByBno(bno).get();

    }

    @Test
    public void modify(){
        //given
        Long bno = 154L;
        String title = "title update";
        String content = "content update";
        String currentEmail = "user1@aaa.com";

        BoardDTO boardDTO = BoardDTO.builder()
                .bno(bno)
                .title(title)
                .content(content)
                .updateTime(LocalDateTime.now())
                .build();

        boardDTO.setUploadFileNames(
                List.of(
                        UUID.randomUUID() + "_" + "update_test1.jpg",
                        UUID.randomUUID() + "_" + "update_test2.jpg"
                )
        );


        //when
        boardService.modify(bno, boardDTO, currentEmail);
        Board board = boardRepository.findByBno(bno).get();

        //then
        assertThat(board.getTitle()).isEqualTo("title update");
        assertThat(board.getContent()).isEqualTo("content update");
        log.info("##############################board = {}" , board);

    }

    @Test
    public void remove(){
        //given
        Long bno = 154L;
        String currentEmail = "user1@aaa.com";

        //when
        boardService.remove(bno, currentEmail);
        Optional<Board> deletedBoard = boardRepository.findByBno(bno);

        //then
        assertThat(deletedBoard).isEmpty();

    }

    @Test
    public void getPageResponse(){
        //given
        PageRequestDTO pageRequestDTO = new PageRequestDTO();

        BoardSearchDTO boardSearchDTO = BoardSearchDTO.builder()
                .title("title")
                .content("content")
                .keyword("test")
                .build();

        //when
        PageResponseDTO<BoardDTO> pageResponse = boardService.getPageResponse(pageRequestDTO, boardSearchDTO);

        //then
        log.info("############################## getPageResponse ##############################");
        log.info("pageResponse={}", pageResponse);
        log.info("############################## getPageResponse ##############################");

    }

}