package okestro.assignment.dto.page;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Getter
@Setter
@ToString
public class PageResponseDTO<E> {
    private List<E> dtoList;
    private List<Integer> pageNumList;
    private PageRequestDTO pageRequestDTO;
    private boolean prev, next;
    private int totalCount, prevPage, nextPage, totalPage, current;

    @Builder
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO, int totalCount) {
        this.dtoList = dtoList;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = totalCount;

        int end = (int) (Math.ceil(pageRequestDTO.getPage() / (double) pageRequestDTO.getSize())) * pageRequestDTO.getSize();
        int start = end - pageRequestDTO.getSize() + 1;
        int last = (int) (Math.ceil(totalCount / (double) pageRequestDTO.getSize()));
        end = end > last ? last : end;
        prev = start > 1;
        next = last > end;
        pageNumList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());

        if (prev) {
            prevPage = start - 1;
        }

        if (next) {
            nextPage = end + 1;
        }

        totalPage = pageNumList.size();
        current = pageRequestDTO.getPage();
    }

}
