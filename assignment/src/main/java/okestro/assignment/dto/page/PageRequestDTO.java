package okestro.assignment.dto.page;


import lombok.*;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
public class PageRequestDTO {
    private int page;
    private int size;

    public PageRequestDTO() {
        this.page = 1;
        this.size = 10;
    }

}
