package okestro.assignment.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Todo;
import okestro.assignment.dto.TodoDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService{

    private final TodoRepository todoRepository;

    @Override
    public Long register(TodoDTO todoDTO) {
        log.info("register success.....");
        Todo todo = todoDTO.toEntity(todoDTO);
        Todo savedTodo = todoRepository.save(todo);
        Long tno = savedTodo.getTno();
        return tno;
    }

    @Override
    public TodoDTO getTodoDtl(Long tno) {
        Optional<Todo> result = todoRepository.findByTno(tno);
        Todo todo = result.orElseThrow();
        TodoDTO todoDTO = todo.toDTO(todo);
        return todoDTO;
    }

    @Override
    public void modify(TodoDTO todoDTO) {
        Long tno = todoDTO.getTno();
        todoRepository.update(tno, todoDTO);
    }

    @Override
    public void remove(Long tno) {
        todoRepository.deleteByTno(tno);
    }

    @Override
    public PageResponseDTO<TodoDTO> getPageResponse(PageRequestDTO pageRequestDTO) {
        int offset = 0;
        int limit = 0;
        int totalCount = 0;

        offset = (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize();
        limit = pageRequestDTO.getSize();
        totalCount = todoRepository.getTotalCount();

        List<Todo> todoList = todoRepository.findTodoList(offset, limit);
        List<TodoDTO> todoDTOList = new ArrayList<>();
        for (Todo todo : todoList) {
            TodoDTO todoDTO = todo.toDTO(todo);
            todoDTOList.add(todoDTO);
        }
        /*List<TodoDTO> todoDTOList = todoList.stream()
                .map(todo -> todo.toDTO(todo))
                .toList();*/

        PageResponseDTO<TodoDTO> pageResponseDTO = PageResponseDTO.<TodoDTO>builder()
                .dtoList(todoDTOList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return pageResponseDTO;
    }


}
