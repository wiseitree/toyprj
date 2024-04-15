package okestro.assignment.repository;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Todo;
import okestro.assignment.dto.TodoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static org.assertj.core.api.Assertions.*;


@SpringBootTest
@Slf4j
class TodoRepositoryTest {

    @Autowired
    private TodoRepository todoRepository;

    @BeforeEach
    void createDummy() {
        for (int i = 1; i <= 135; i++) {

            Todo todo = Todo.builder()
                    .title("title..." + i)
                    .writer("writer..." + i)
                    .dueDate(LocalDate.of(2024, 3, 14))
                    .build();

            todoRepository.save(todo);
        }
    }


    @Test
    public void insert() {
        Todo todo = Todo.builder()
                .title("title")
                .writer("writer")
                .dueDate(LocalDate.of(2024, 3, 14))
                .build();

        todoRepository.save(todo);
    }

    @Test
    public void read() {
        Long tno = 1L;
        Optional<Todo> result = todoRepository.findByTno(tno);
        Todo todo = result.get();
        log.info("todo ={}", todo);
    }

    @Test
    public void update() {
        //given
        Long tno = 33L;
        Optional<Todo> result = todoRepository.findByTno(tno);

        String updateTitle = "updateTitle";
        boolean updateComplete = true;
        LocalDate updateDueDate = LocalDate.of(2024, 3, 15);

        //when
        TodoDTO todoDTO = TodoDTO.builder()
                .title(updateTitle)
                .complete(updateComplete)
                .dueDate(updateDueDate)
                .build();

        todoRepository.update(tno, todoDTO);

        //then
        Todo updateTodo = todoRepository.findByTno(tno).orElseThrow();
        assertThat(updateTodo.getTitle()).isEqualTo("updateTitle");
    }

    @Test
    public void delete(){
        //given
        Long tno = 33L;

        //when
        todoRepository.deleteByTno(tno);
        Optional<Todo> deletedTodo = todoRepository.findByTno(tno);

        //then
        assertThat(deletedTodo).isEmpty();


    }

    @Test
    public void findTodoList(){
        //given
        int offset = 10;
        int limit = 20;

        //when
        List<Todo> todoList = todoRepository.findTodoList(offset, limit);
        /*List<TodoDTO> result = todoList.stream()
                .map(todo -> todo.toDTO(todo))
                .toList();*/
        List<TodoDTO> result = new ArrayList<>();
        for (Todo todo : todoList) {
            TodoDTO todoDTO = todo.toDTO(todo);
            result.add(todoDTO);
        }

        //then
        for (TodoDTO todoDTO : result) {
            System.out.println("todoDTO = " + todoDTO);
        }

        int totalCount = todoRepository.getTotalCount();
        System.out.println("totalCount = " + totalCount);

    }

}