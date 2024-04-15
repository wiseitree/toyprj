package okestro.assignment.repository;

import lombok.RequiredArgsConstructor;
import okestro.assignment.domain.Todo;
import okestro.assignment.dto.TodoDTO;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TodoRepository {

    private final TodoMapper todoMapper;

    public Todo save(Todo todo) {
        todoMapper.save(todo);
        return todo;
    }

    public Optional<Todo> findByTno(Long tno){
        return todoMapper.findByTno(tno);
    }

    public void update(Long tno, TodoDTO todoDTO){
        todoMapper.update(tno, todoDTO);
    }

    public void deleteByTno(Long tno){
        todoMapper.deleteByTno(tno);
    }

    public List<Todo> findTodoList(int offset, int limit){
        return todoMapper.findTodoList(offset, limit);
    }

    public int getTotalCount(){
        return todoMapper.getTotalCount();
    }

}
