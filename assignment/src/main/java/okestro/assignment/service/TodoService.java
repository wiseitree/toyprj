package okestro.assignment.service;

import okestro.assignment.dto.TodoDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;

public interface TodoService {
    Long register(TodoDTO todoDto);

    TodoDTO getTodoDtl(Long tno);

    void modify(TodoDTO todoDto);

    void remove(Long tno);

    PageResponseDTO<TodoDTO> getPageResponse(PageRequestDTO pageRequestDTO);

}
