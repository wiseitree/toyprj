package okestro.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.repository.BoardRepository;
import okestro.assignment.service.BoardService;
import okestro.assignment.util.CustomFileUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/board")
public class BoardController {

    private final CustomFileUtil fileUtil;
    private final BoardService boardService;
    private final BoardRepository boardRepository;

    @GetMapping("/{bno}")
    public BoardDTO getBoardDtl(@PathVariable Long bno) {
        return boardService.getBoardDtl(bno);
    }

    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping("/list")
    public PageResponseDTO<BoardDTO> list(PageRequestDTO pageRequestDTO, BoardSearchDTO boardSearchDTO) {
        log.info("#################### BoardController - /api/board/list");
        log.info("pageRequestDTO: {}", pageRequestDTO);
        log.info("boardSearchDTO: {}", boardSearchDTO);
        PageResponseDTO<BoardDTO> pageResponseDTO = boardService.getPageResponse(pageRequestDTO, boardSearchDTO);
        return pageResponseDTO;
    }

    @PostMapping("/")
    public ResponseEntity<?> register(@Valid BoardDTO boardDTO, BindingResult bindingResult) {
        Map<String, Long> result = new HashMap<>();

        if (bindingResult.hasErrors()) {
//            result.put("result", "error");
            return ResponseEntity.badRequest().body(Map.of("result", "error"));
        }

        log.info("#####BoardController - /api/board/register - BoardDTO {}", boardDTO);
        List<MultipartFile> files = boardDTO.getFiles();
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        boardDTO.setUploadFileNames(uploadFileNames);
        log.info("#####BoardController - /api/board/register - uploadFileNames {}", uploadFileNames);

        Long bno = boardService.register(boardDTO);
        result.put("result", bno);
//        Map<String, Long> map = Map.of("bno", bno);
        return ResponseEntity.ok(result);
    }


    @PutMapping("/{bno}")
    public ResponseEntity<Map<String, String>> modify(@PathVariable Long bno, @Valid BoardDTO boardDTO, BindingResult bindingResult, @RequestHeader("CurrentData") String currentEmail) {
        Map<String, String> result = new HashMap<>();

        if (bindingResult.hasErrors()) {
            result.put("result", "error");
            return ResponseEntity.badRequest().body(result);
        }

        BoardDTO oldBoardDTO = boardService.getBoardDtl(bno);
        List<String> oldFileNames = oldBoardDTO.getUploadFileNames();

        List<MultipartFile> files = boardDTO.getFiles();
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);

        List<String> uploadFileNames = boardDTO.getUploadFileNames();

        if (currentUploadFileNames != null && currentUploadFileNames.size() > 0)
            uploadFileNames.addAll(currentUploadFileNames);

        boardService.modify(bno, boardDTO, currentEmail);

        if (oldFileNames != null && oldFileNames.size() > 0){
            List<String> removeFiles = oldFileNames
                    .stream()
                    .filter(fileName -> uploadFileNames.indexOf(fileName) == -1)
                    .collect(Collectors.toList());

            fileUtil.deleteFiles(removeFiles);
        }


        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/{bno}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable Long bno, @RequestHeader("CurrentData") String currentEmail) {
        Map<String, String> result = new HashMap<>();

        List<String> oldFileNames = boardService.getBoardDtl(bno).getUploadFileNames();
        boardService.remove(bno, currentEmail);
        fileUtil.deleteFiles(oldFileNames);

        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGet(@PathVariable String fileName){
        return fileUtil.getFile(fileName);
    }

}
