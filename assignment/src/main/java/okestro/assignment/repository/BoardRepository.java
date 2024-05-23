package okestro.assignment.repository;

import lombok.RequiredArgsConstructor;
import okestro.assignment.domain.Board;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import okestro.assignment.repository.BoardMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class BoardRepository {

    private final BoardMapper boardMapper;

    public Board save(Board board){
        boardMapper.save(board);
        return board;
    }

    public Optional<Board> findByBno(Long bno){
        return boardMapper.findByBno(bno);
    }

    public void updateViewCount(Long bno, long updateViewCount){
        boardMapper.updateViewCount(bno, updateViewCount);
    }

    public void update(Long bno, BoardDTO boardDTO){
        boardMapper.update(bno, boardDTO);
    }

    public void deleteByBno(Long bno){
        boardMapper.deleteByBno(bno);
    }

    public void saveBoardImage(Board board){
        boardMapper.saveBoardImage(board);
    }

    public void deleteBoardImage(Long bno){
        boardMapper.deleteBoardImage(bno);
    }

    public List<Board> findBoardList(int offset, int limit, BoardSearchDTO boardSearchDTO){
        return boardMapper.findBoardList(offset, limit, boardSearchDTO);
    }

    public int getTotalCount(BoardSearchDTO boardSearchDTO){
        return boardMapper.getTotalCount(boardSearchDTO);
    }


}
