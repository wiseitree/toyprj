package okestro.assignment.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class BoardImage {

    private String fileName;

    private int ord;

    public void setOrd(int ord) {
        this.ord = ord;
    }

    @Builder
    public BoardImage(String fileName, int ord) {
        this.fileName = fileName;
        this.ord = ord;
    }

}

