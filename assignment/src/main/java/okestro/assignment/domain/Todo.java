package okestro.assignment.domain;

import lombok.*;
import okestro.assignment.dto.TodoDTO;

import java.time.LocalDate;

@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Todo {
    private Long tno;
    private String title;
    private String writer;
    private boolean complete;
    private LocalDate dueDate;

    @Builder
    public Todo(String title, String writer, LocalDate dueDate) {
        this.title = title;
        this.writer = writer;
        this.dueDate = dueDate;
    }

    public TodoDTO toDTO(Todo todo){
        TodoDTO todoDTO = TodoDTO.builder()
                .tno(todo.tno)
                .title(todo.title)
                .writer(todo.writer)
                .complete(todo.complete)
                .dueDate(todo.dueDate)
                .build();

        return todoDTO;
    }

}
