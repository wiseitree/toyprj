package okestro.assignment.repository;

import okestro.assignment.domain.Todo;
import okestro.assignment.dto.TodoDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface TodoMapper {
    void save(Todo todo);

    Optional<Todo> findByTno(Long tno);

    void update(@Param("tno") Long tno, @Param("todoDTO") TodoDTO todoDTO);

    void deleteByTno(Long tno);

    List<Todo> findTodoList(@Param("offset") int offset, @Param("limit") int limit);

    int getTotalCount();

}
