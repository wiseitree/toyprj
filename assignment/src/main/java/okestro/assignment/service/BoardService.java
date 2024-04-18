package okestro.assignment.service;

import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;

public interface BoardService {

    Long register(BoardDTO boardDTO);

    BoardDTO getBoardDtl(Long bno);

    void modify(Long bno, BoardDTO boardDTO, String CurrentEmail);

    void remove(Long bno, String CurrentEmail);

    PageResponseDTO<BoardDTO> getPageResponse(PageRequestDTO pageRequestDTO, BoardSearchDTO boardSearchDTO);
}
