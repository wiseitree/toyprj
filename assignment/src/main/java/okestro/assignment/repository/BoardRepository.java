package okestro.assignment.repository;

import lombok.RequiredArgsConstructor;
import okestro.assignment.domain.Board;
import okestro.assignment.dto.BoardDTO;
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

    public void update(Long bno, BoardDTO boardDTO){
        boardMapper.update(bno, boardDTO);
    }

    public void deleteByBno(Long bno){
        boardMapper.deleteByBno(bno);
    }

    public List<Board> findBoardList(int offset, int limit){
        return boardMapper.findBoardList(offset, limit);
    }

    public int getTotalCount(){
        return boardMapper.getTotalCount();
    }
}
