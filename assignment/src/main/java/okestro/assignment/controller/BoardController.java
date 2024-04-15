package okestro.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.repository.BoardRepository;
import okestro.assignment.service.BoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/board")
public class BoardController {
    private final BoardService boardService;
    private final BoardRepository boardRepository;

    @GetMapping("/{bno}")
    public BoardDTO getBoardDtl(@PathVariable Long bno) {
        return boardService.getBoardDtl(bno);
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')")
    @GetMapping("/list")
    public PageResponseDTO<BoardDTO> list(PageRequestDTO pageRequestDTO) {
        PageResponseDTO<BoardDTO> pageResponseDTO = boardService.getPageResponse(pageRequestDTO);
        return pageResponseDTO;
    }

    @PostMapping("/")
    public ResponseEntity<?> register(@Valid @RequestBody BoardDTO boardDTO, BindingResult bindingResult) {
        Map<String, String> result = new HashMap<>();

        if (bindingResult.hasErrors()) {
            result.put("result", "error");
            return ResponseEntity.badRequest().body(result);
        }
        Long bno = boardService.register(boardDTO);
        result.put("bno", bno.toString());
//        Map<String, Long> map = Map.of("bno", bno);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{bno}")
    public ResponseEntity<Map<String, String>> modify(@PathVariable Long bno, @Valid @RequestBody BoardDTO boardDTO, BindingResult bindingResult, @RequestHeader("CurrentData") String currentEmail) {
        Map<String, String> result = new HashMap<>();

        if (bindingResult.hasErrors()) {
            result.put("result", "error");
            return ResponseEntity.badRequest().body(result);
        }

        boardService.modify(bno, boardDTO, currentEmail);

        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/{bno}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable Long bno, @RequestHeader("CurrentData") String currentEmail) {
        Map<String, String> result = new HashMap<>();
        boardService.remove(bno, currentEmail);
        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }


}
