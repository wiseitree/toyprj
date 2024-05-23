package okestro.assignment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Board;
import okestro.assignment.domain.BoardImage;
import okestro.assignment.domain.Member;
import okestro.assignment.domain.MemberRole;
import okestro.assignment.dto.BoardDTO;
import okestro.assignment.dto.BoardSearchDTO;
import okestro.assignment.dto.page.PageRequestDTO;
import okestro.assignment.dto.page.PageResponseDTO;
import okestro.assignment.exception.CustomNotSameMemberException;
import okestro.assignment.repository.BoardRepository;
import okestro.assignment.repository.MemberRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final ObjectMapper objectMapper;

    @Override
    public Long register(BoardDTO boardDTO) {
        Member member = memberRepository.findByEmail(boardDTO.getEmail()).orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        Board board = dtoToEntity(boardDTO, member);

        Board savedBoard = boardRepository.save(board);

        List<BoardImage> boardImageList = board.getImageList();
        if (boardImageList != null && boardImageList.size() > 0) {
            boardRepository.saveBoardImage(board);
        }

        Long bno = savedBoard.getBno();

        return bno;
    }

    @Override
    public BoardDTO getBoard(Long bno, Cookie boardViewCount) throws JsonProcessingException {
        BoardDTO boardDTO = getBoardDtl(bno);
        updateViewCount(bno, boardViewCount);

        return boardDTO;
    }

    private void updateViewCount(Long bno, Cookie boardViewCount) throws JsonProcessingException {
        String decodeValue = URLDecoder.decode(boardViewCount.getValue(), StandardCharsets.UTF_8);
        Set<Long> bnoSet = objectMapper.readValue(decodeValue, new TypeReference<Set<Long>>() {
        });

        Board board = boardRepository.findByBno(bno)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 게시판입니다."));

        long viewCount = board.getViewCount();
        long updateViewCount = viewCount + 1;
        boardRepository.updateViewCount(bno, updateViewCount);
    }

    @Override
    public BoardDTO getBoardDtl(Long bno) {
        log.info("#################### BoardServiceImpl - getBoardDtl");
        Board board = boardRepository.findByBno(bno).orElseThrow(() -> new NoSuchElementException("존재하지 않는 게시판입니다."));
        log.info("########## board = {}", board);
        BoardDTO boardDTO = entityToDTO(board);
        return boardDTO;
    }

    @Override
    public void modify(Long bno, BoardDTO boardDTO, String currentEmail) {
        if (!isSameMember(bno, currentEmail)) {
            throw new CustomNotSameMemberException("해당 작업을 수행할 수 있는 회원이 아닙니다.");
        }

        log.info("#################### BoardServiceImpl - modify");

        boardDTO.setBno(bno);
        boardDTO.setUpdateTime(LocalDateTime.now());
        boardRepository.update(bno, boardDTO);

        List<String> uploadFileNames = boardDTO.getUploadFileNames();
        Board board = boardRepository.findByBno(boardDTO.getBno()).get();

        board.clearList();
        boardRepository.deleteBoardImage(bno);

        if (uploadFileNames != null && uploadFileNames.size() > 0){

            uploadFileNames.stream().forEach(uploadFileName -> {
                board.addImageString(uploadFileName);
            });
            boardRepository.saveBoardImage(board);
        }

    }

    @Override
    public void remove(Long bno, String currentEmail) {
        if (isAdmin(currentEmail)){
            boardRepository.deleteByBno(bno);
            return;
        }

        if (!isSameMember(bno, currentEmail)) {
            throw new CustomNotSameMemberException("해당 작업을 수행할 수 있는 회원이 아닙니다.");
        }

        log.info("#################### BoardServiceImpl ");
        boardRepository.deleteByBno(bno);
    }

    @Override
    public PageResponseDTO<BoardDTO> getPageResponse(PageRequestDTO pageRequestDTO, BoardSearchDTO boardSearchDTO) {
        int offset = 0;
        int limit = 0;
        int totalCount = 0;

        offset = (pageRequestDTO.getPage() - 1) * pageRequestDTO.getSize();
        limit = pageRequestDTO.getSize();
        totalCount = boardRepository.getTotalCount(boardSearchDTO);
        log.info("#################### BoardServiceImpl - totalCount = {}", totalCount);


        List<Board> boardList = boardRepository.findBoardList(offset, limit, boardSearchDTO);
        List<BoardDTO> boardDTOList = new ArrayList<>();

        for (Board board : boardList) {
            BoardDTO boardDTO = board.toDTO(board);
            List<BoardImage> imageList = board.getImageList();

            List<String> uploadFileNames = createUploadFileNames(imageList);

            boardDTO.setUploadFileNames(uploadFileNames);
            boardDTOList.add(boardDTO);
        }

        PageResponseDTO<BoardDTO> pageResponseDTO = PageResponseDTO.<BoardDTO>builder()
                .dtoList(boardDTOList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

        return pageResponseDTO;
    }

    private static List<String> createUploadFileNames(List<BoardImage> imageList) {
        List<String> uploadFileNames = new ArrayList<>();

        for (BoardImage boardImage : imageList) {
            String fileName = boardImage.getFileName();
            uploadFileNames.add(fileName);
        }

        return uploadFileNames;
    }


    private boolean isSameMember(Long bno, String currentEmail) {
        Board board = boardRepository.findByBno(bno)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 게시판입니다."));

        if (!board.getMember().getEmail().equals(currentEmail))
            return false;

        return true;

    }

    private boolean isAdmin(String currentEmail) {
        boolean admin = false;

        Member member = memberRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        List<MemberRole> memberRoleList = member.getMemberRoleList();
        for (MemberRole memberRole : memberRoleList) {
            if (memberRole == MemberRole.ADMIN)
                admin = true;
        }

        return admin;
    }

    private Board dtoToEntity(BoardDTO boardDTO, Member member){
        Board board = boardDTO.toEntity(boardDTO, member);

        List<String> uploadFileNames = boardDTO.getUploadFileNames();

        if (uploadFileNames == null)
            return board;

        for (String uploadFileName : uploadFileNames) {
            board.addImageString(uploadFileName);
        }

        return board;
    }

    private BoardDTO entityToDTO(Board board){
        BoardDTO boardDTO = board.toDTO(board);
        List<BoardImage> imageList = board.getImageList();

        if (imageList == null || imageList.size() == 0){
            return boardDTO;
        }


        List<String> fileNameList = imageList.stream().map(boardImage ->
                boardImage.getFileName()).toList();

        boardDTO.setUploadFileNames(fileNameList);

        return boardDTO;
    }

}
