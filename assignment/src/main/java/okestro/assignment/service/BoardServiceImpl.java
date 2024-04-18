package okestro.assignment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.domain.Member;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.exception.CustomNotSameMemberException;
import okestro.assignment.repository.BoardRepository;
import okestro.assignment.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService{

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;


    @Override
    public Long register(BoardDTO boardDTO) {
        log.info("#################### BoardServiceImpl - register");
        Member member = memberRepository.findByEmail(boardDTO.getEmail()).orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));
        Board board = boardDTO.toEntity(boardDTO, member);
        Board savedBoard = boardRepository.save(board);
        Long bno = savedBoard.getBno();

        return bno;
    }

    @Override
    public BoardDTO getBoardDtl(Long bno) {
        log.info("#################### BoardServiceImpl - getBoardDtl");
        Board board = boardRepository.findByBno(bno).orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));
        log.info("########## board = {}", board);
        BoardDTO boardDTO = board.toDTO(board);
        return boardDTO;
    }

    @Override
    public void modify(Long bno, BoardDTO boardDTO, String currentEmail) {
        if (!isSameMember(bno, currentEmail)){
            throw new CustomNotSameMemberException("해당 작업을 수행할 수 있는 회원이 아닙니다.");
        }

        log.info("#################### BoardServiceImpl - modify");

        boardDTO.setBno(bno);
        boardDTO.setUpdateTime(LocalDateTime.now());
        boardRepository.update(bno, boardDTO);
    }

    @Override
    public void remove(Long bno, String currentEmail) {
        if (!isSameMember(bno, currentEmail)){
            throw new CustomNotSameMemberException("해당 작업을 수행할 수 있는 회원이 아닙니다.");
        }

        log.info("#################### BoardServiceImpl ");
        boardRepository.deleteByBno(bno);
    }

    @Override
    public PageResponseDTO<BoardDTO> getPageResponse(PageRequestDTO pageRequestDTO, BoardSearchDTO boardSearchDTO) {
        int offset = 0;
        int limit = 0;
        int totalCount = 0;

        offset = (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize();
        limit = pageRequestDTO.getSize();
        totalCount = boardRepository.getTotalCount(boardSearchDTO);
        log.info("#################### BoardServiceImpl - totalCount = {}", totalCount);



        List<Board> boardList = boardRepository.findBoardList(offset, limit, boardSearchDTO);
        List<BoardDTO> boardDTOList = new ArrayList<>();
        for (Board board : boardList) {
            BoardDTO boardDTO = board.toDTO(board);
            boardDTOList.add(boardDTO);
        }

        PageResponseDTO<BoardDTO> pageResponseDTO = PageResponseDTO.<BoardDTO>builder()
                .dtoList(boardDTOList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return pageResponseDTO;
    }


    private boolean isSameMember(Long bno, String currentEmail) {
        Board board = boardRepository.findByBno(bno).orElseThrow(() -> new NoSuchElementException("존재하지 않는 게시판입니다."));

        if (!board.getMember().getEmail().equals(currentEmail))
            return false;

        return true;

    }


}
