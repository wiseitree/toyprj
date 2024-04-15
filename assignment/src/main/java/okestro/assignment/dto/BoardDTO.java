package okestro.assignment.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import okestro.assignment.domain.Board;
import okestro.assignment.domain.Member;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class BoardDTO {
    private Long bno;
    @NotBlank(message = "제목을 올바르게 입력해주세요.")
    @Size(max = 80)
    private String title;
    @NotBlank(message = "내용을 올바르게 입력해주세요.")
    @Size(max = 2000)
    private String content;
    private String email;
    private String writer;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime regTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime updateTime;

    @Builder
    public BoardDTO(Long bno, String title, String content, String email, String writer, LocalDateTime regTime, LocalDateTime updateTime) {
        this.bno = bno;
        this.title = title;
        this.content = content;
        this.email = email;
        this.writer = writer;
        this.regTime = regTime;
        this.updateTime = updateTime;
    }

    public Board toEntity(BoardDTO boardDTO, Member member){
        Board board = Board.builder()
                .title(boardDTO.getTitle())
                .content(boardDTO.getContent())
                .member(member)
                .writer(boardDTO.getWriter())
                .build();

        return board;
    }

}
