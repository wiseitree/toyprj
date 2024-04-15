package okestro.assignment.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.dto.TodoDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.service.TodoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/todo")
public class TodoController {
    private final TodoService todoService;

    @GetMapping("/{tno}")
    public TodoDTO getTodoDtl(@PathVariable Long tno){
        return todoService.getTodoDtl(tno);
    }

    @PreAuthorize("hasAnyRole('ROLE_USER')")
    @GetMapping("/list")
    public PageResponseDTO<TodoDTO> list(PageRequestDTO pageRequestDTO){
        log.info("pageRequestDTO= {}", pageRequestDTO);
        PageResponseDTO<TodoDTO> pageResponseDTO = todoService.getPageResponse(pageRequestDTO);
        return pageResponseDTO;
    }

    @PostMapping("/")
    public Map<String, Long> register(@RequestBody TodoDTO todoDTO){
        log.info("TodoDTO = {}", todoDTO);
        Long tno = todoService.register(todoDTO);
        Map<String, Long> map = Map.of("TNO", tno);
        return map;
    }

    @PutMapping("/{tno}")
    public Map<String, String> modify(@PathVariable Long tno, @RequestBody TodoDTO todoDTO){
        todoDTO.setTno(tno);
        log.info("Modify: " + todoDTO);
        todoService.modify(todoDTO);

        Map<String, String> result = Map.of("RESULT", "SUCCESS");
        return result;
    }

    @DeleteMapping("/{tno}")
    public Map<String, String> remove(@PathVariable Long tno){
        log.info("Remove: " + tno);
        todoService.remove(tno);
        Map<String, String> result = Map.of("Result", "SUCCESS");
        return result;
    }



}
