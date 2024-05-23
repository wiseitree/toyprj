package okestro.assignment.repository;

import okestro.assignment.domain.Board;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {

    void save(Board board);

    void saveBoardImage(Board board);

    Optional<Board> findByBno(Long bno);

    void updateViewCount(@Param("bno") Long bno, @Param("updateViewCount") long updateViewCount);

    void update(@Param("bno") Long bno, @Param("boardDTO") BoardDTO boardDTO);

    void deleteByBno(Long bno);

    void deleteBoardImage(Long bno);

    List<Board> findBoardList(@Param("offset") int offset, @Param("limit") int limit, @Param("boardSearchDTO")
    BoardSearchDTO boardSearchDTO);

    int getTotalCount(BoardSearchDTO boardSearchDTO);

}
