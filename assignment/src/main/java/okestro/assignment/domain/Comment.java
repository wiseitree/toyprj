package okestro.assignment.domain;


import lombok.*;
import okestro.assignment.dto.CommentDTO;

import java.time.LocalDateTime;

@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment {
    private Long cno;
    private Long bno;
    private String content;
    private String email;
    private String nickname;
    private LocalDateTime regTime;
    private LocalDateTime updateTime;
    private boolean delFlag = false;

    public void changeDelFlag(boolean delFlag) {
        this.delFlag = delFlag;
    }

    @Builder
    public Comment(Long bno, String content, String email, String nickname) {
        this.bno = bno;
        this.content = content;
        this.email = email;
        this.nickname = nickname;
    }

    public CommentDTO toDTO(Comment comment) {
        CommentDTO commentDTO = CommentDTO.builder()
                .cno(comment.getCno())
                .bno(comment.getBno())
                .content(comment.getContent())
                .email(comment.getEmail())
                .nickname(comment.getNickname())
                .regTime(comment.getRegTime())
                .updateTime(comment.getUpdateTime())
                .delFlag(comment.isDelFlag())
                .build();

        return commentDTO;
    }

}
