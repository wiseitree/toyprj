package okestro.assignment.domain;


import lombok.*;
import okestro.assignment.dto.BoardDTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Board {
    private Long bno;
    private String title;
    private String content;
    private Member member;
    private String writer;
    private LocalDateTime regTime;
    private LocalDateTime updateTime;
    private List<BoardImage> imageList = new ArrayList<>();
    private long viewCount;
    private int commentCount;


    public void addImage(BoardImage image){
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName){
        BoardImage boardImage = BoardImage.builder()
                .fileName(fileName)
                .build();

        addImage(boardImage);
    }

    public void clearList(){
        this.imageList.clear();
    }


    @Builder
    public Board(String title, String content, Member member, String writer){
        this.title = title;
        this.content = content;
        this.member = member;
        this.writer = writer;
    }

    public BoardDTO toDTO(Board board){
        BoardDTO boardDTO = BoardDTO.builder()
                .bno(board.bno)
                .title(board.title)
                .content(board.content)
                .email(board.getMember().getEmail())
                .writer(board.writer)
                .regTime(board.regTime)
                .updateTime(board.updateTime)
                .viewCount(board.viewCount)
                .commentCount(board.commentCount)
                .build();

        return boardDTO;
    }

}
