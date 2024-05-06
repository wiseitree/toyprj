package okestro.assignment.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import okestro.assignment.domain.Comment;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class CommentDTO {
    private Long cno;
    private Long bno;
    @NotBlank(message = "내용을 올바르게 입력해주세요.")
    @Size(max = 1000)
    private String content;
    private String email;
    private String nickname;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime regTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime updateTime;
    private boolean delFlag;


    @Builder
    public CommentDTO(Long cno, Long bno, String content, String email, String nickname, LocalDateTime regTime, LocalDateTime updateTime, boolean delFlag) {
        this.cno = cno;
        this.bno = bno;
        this.content = content;
        this.email = email;
        this.nickname = nickname;
        this.regTime = regTime;
        this.updateTime = updateTime;
        this.delFlag = delFlag;
    }

    public Comment toEntity(CommentDTO commentDTO){
        Comment comment = Comment.builder()
                .bno(commentDTO.getBno())
                .content(commentDTO.getContent())
                .email(commentDTO.getEmail())
                .nickname(commentDTO.getNickname())
                .build();

        return comment;
    }

}
