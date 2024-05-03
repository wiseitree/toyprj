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
import java.util.Optional;

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
        String email = "usertest@aaa.com";
        String writer = "testuser";

        BoardDTO boardDTO = BoardDTO.builder()
                .title(title)
                .content(content)
                .email(email)
                .writer(writer)
                .build();

        //when
        Long bno = boardService.register(boardDTO);
        Board savedBoard = boardRepository.findByBno(bno).get();

        //then
        assertThat(savedBoard.getTitle()).isEqualTo("title register");
        assertThat(savedBoard.getMember().getEmail()).isEqualTo("usertest@aaa.com");
        log.info("############################## savedBoard = {}", savedBoard);
        log.info("############################## savedBoard.getMember = {}", savedBoard.getMember());

    }

    @Test
    public void getBoardDtl() {
        //given
        Long bno = 138L;

        //when
        BoardDTO boardDTO = boardService.getBoardDtl(bno);

        //then
        log.info("##############################boardDTO = {}" , boardDTO);

    }

    @Test
    public void modify(){
        //given
        Long bno = 139L;
        String title = "title update";
        String content = "content update";
        String currentEmail = "user1@aaa.com";

        BoardDTO boardDTO = BoardDTO.builder()
                .bno(bno)
                .title(title)
                .content(content)
                .updateTime(LocalDateTime.now())
                .build();

        //when
        boardService.modify(bno, boardDTO, currentEmail);
        Board board = boardRepository.findByBno(bno).get();

        //then
        assertThat(board.getTitle()).isEqualTo("title update");
        assertThat(board.getContent()).isEqualTo("content update");

    }

    @Test
    public void remove(){
        //given
        Long bno = 53L;
        String currentEmail = "admin@aaa.com";

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
        pageRequestDTO.setPage(3);

        BoardSearchDTO boardSearchDTO = BoardSearchDTO.builder()
                .title("title")
                .content("content")
                .keyword("content")
                .build();

        //when
        PageResponseDTO<BoardDTO> pageResponse = boardService.getPageResponse(pageRequestDTO, boardSearchDTO);

        //then
        log.info("############################## getPageResponse ##############################");
        log.info("pageResponse={}", pageResponse);
        log.info("############################## getPageResponse ##############################");

    }




}