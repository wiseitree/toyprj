package okestro.assignment.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import okestro.assignment.domain.Todo;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class TodoDTO {
    private Long tno;
    private String title;
    private String writer;
    private boolean complete;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @Builder
    public TodoDTO(Long tno, String title, String writer, boolean complete, LocalDate dueDate){
        this.tno = tno;
        this.title = title;
        this.writer = writer;
        this.complete = complete;
        this.dueDate = dueDate;
    }

    public Todo toEntity(TodoDTO todoDTO){
        Todo todo = Todo.builder()
                .title(todoDTO.getTitle())
                .writer(todoDTO.getWriter())
                .dueDate(todoDTO.getDueDate())
                .build();

        return todo;
    }

}
