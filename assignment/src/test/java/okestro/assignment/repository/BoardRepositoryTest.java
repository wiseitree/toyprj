package okestro.assignment.repository;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.domain.BoardImage;
import okestro.assignment.domain.Member;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
                    .title("user1 title test")
                    .content("user1 content test")
                    .member(member)
                    .build();

            Board savedBoard = boardRepository.save(board);
        }

    }

    @Test
    public void insert() {
        //given
        String email = "user1@aaa.com";

        String title = "file add test";
        String content = "content test";

        Member member = memberRepository.findByEmail(email).get();
        Board board = Board.builder()
                .title(title)
                .content(content)
                .member(member)
                .build();

        board.addImageString(UUID.randomUUID().toString() + "_" + "IMAGE1.jpg");
        board.addImageString(UUID.randomUUID().toString() + "_" + "IMAGE2.jpg");

        //when
        Board savedBoard = boardRepository.save(board);

        List<BoardImage> boardImageList = board.getImageList();
        if (boardImageList != null && boardImageList.size() > 0) {
            boardRepository.saveBoardImage(board);
        }

        //then
        log.info("savedBoard: {}", savedBoard);

    }

    @Test
    public void read() {
        //given
        Long bno = 136L;

        //when
        Board board = boardRepository.findByBno(bno).get();

        //then
//        assertThat(board.getWriter()).isEqualTo(board.getMember().getNickname());

        //log
        log.info("board = {}", board);
        log.info("board.getMember = {}", board.getMember());

    }

    @Test
    public void updateViewCount() {
        //given
        Long bno = 142L;
        Board board = boardRepository.findByBno(bno).get();
        long viewCount = board.getViewCount();
        long updateViewCount = viewCount + 1;

        //when
        boardRepository.updateViewCount(bno, updateViewCount);

        //then
        log.info("board = {}", board);

    }

    @Test
    public void update() {
        //given
        Long bno = 153L;

        Board board = boardRepository.findByBno(bno)
                .orElseThrow();

        String email = "user1@aaa.com";
        String writer = "user1";
        String title = "file update test";
        String content = "content update test";
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
        boardRepository.deleteBoardImage(bno);

        board.clearList();

        board.addImageString(UUID.randomUUID().toString() + "_" + "NEW_IMAGE1.jpg");
        board.addImageString(UUID.randomUUID().toString() + "_" + "NEW_IMAGE2.jpg");
        board.addImageString(UUID.randomUUID().toString() + "_" + "NEW_IMAGE3.jpg");

        boardRepository.saveBoardImage(board);

        //then
        log.info("board = {}", board);

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
        int offset = 0;
        int limit = 10;

        BoardSearchDTO boardSearchDTO = BoardSearchDTO.builder()
                .build();


        //when
        List<Board> boardList = boardRepository.findBoardList(offset, limit, boardSearchDTO);
        List<BoardDTO> boardDTOList = new ArrayList<>();


        for (Board board : boardList) {
            BoardDTO boardDTO = board.toDTO(board);

            List<BoardImage> imageList = board.getImageList();

            List<String> uploadFileNames = new ArrayList<>();
            for (BoardImage boardImage : imageList) {
                String fileName = boardImage.getFileName();
                uploadFileNames.add(fileName);
            }

            boardDTO.setUploadFileNames(uploadFileNames);
            boardDTOList.add(boardDTO);
        }

        //then
        log.info("#################### BoardRepositoryTest - findBoardList ##############################");
        for (BoardDTO boardDTO : boardDTOList) {
            log.info("boardDTO = {} ", boardDTO);
        }
        log.info("#################### BoardRepositoryTest - findBoardList ##############################");

        int totalCount = boardRepository.getTotalCount(boardSearchDTO);
        log.info("#################### totalCount = {}", totalCount);

    }

    @Test
    public void temp(){
        //given
        int offset = 10;
        int limit = 10;

        BoardSearchDTO boardSearchDTO = BoardSearchDTO.builder()
                .title("title")
                .content("content")
                .keyword("test")
                .build();

        //when
        boardRepository.findBoardList(offset, limit, boardSearchDTO);

        //then

    }

}