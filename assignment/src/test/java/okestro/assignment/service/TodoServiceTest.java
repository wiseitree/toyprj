package okestro.assignment.service;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Todo;
import okestro.assignment.dto.TodoDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Slf4j
class TodoServiceTest {

    @Autowired
    private TodoService todoService;

    @Autowired
    private TodoRepository todoRepository;

    @BeforeEach
    void createDummy() {
        for (int i = 1; i <= 115; i++) {

            Todo todo = Todo.builder()
                    .title("title..." + i)
                    .writer("writer..." + i)
                    .dueDate(LocalDate.of(2024, 3, 14))
                    .build();

            todoRepository.save(todo);
        }

    }

    @Test
    public void register() {
        //given
        String title = "title test";
        String writer = "writer test";
        LocalDate dueDate = LocalDate.of(2024, 3, 15);

        TodoDTO todoDTO = TodoDTO.builder()
                .title(title)
                .writer(writer)
                .dueDate(dueDate)
                .build();

        //when
        Long tno = todoService.register(todoDTO);
        log.info("tno = {}", tno);
    }

    @Test
    public void getTodoDtl() {
        //given
        Long tno = 33L;

        //when
        TodoDTO todoDTO = todoService.getTodoDtl(tno);

        log.info("todoDTO: {}", todoDTO);

    }

    @Test
    public void modify() {
        //given
        Long tno = 33L;

        TodoDTO todoDTO = TodoDTO.builder()
                .tno(tno)
                .title("test title")
                .writer("test writer")
                .complete(true)
                .dueDate(LocalDate.of(2024, 3, 15))
                .build();

        //when
        todoService.modify(todoDTO);
        Optional<Todo> result = todoRepository.findByTno(tno);
        Todo updateTodo = result.orElseThrow();

        //then
        assertThat(updateTodo.getTitle()).isEqualTo("test title");

    }

    @Test
    public void remove() {
        //given
        Long tno = 33L;

        //when
        todoService.remove(tno);
        Optional<Todo> deletedTodo = todoRepository.findByTno(tno);

        //then
        assertThat(deletedTodo).isEmpty();

    }

    @Test
    public void getPageResponse() {

        //given
        PageRequestDTO pageRequestDTO = new PageRequestDTO();
        pageRequestDTO.setPage(3);

        //when
        PageResponseDTO<TodoDTO> pageResponse = todoService.getPageResponse(pageRequestDTO);

        //then
        log.info("pageResponse= {}", pageResponse);

    }


}