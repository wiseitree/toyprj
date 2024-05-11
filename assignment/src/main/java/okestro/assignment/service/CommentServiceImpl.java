package okestro.assignment.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Comment;
import okestro.assignment.domain.Member;
import okestro.assignment.dto.CommentDTO;
import okestro.assignment.repository.CommentRepository;
import okestro.assignment.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;

    @Override
    public Long register(CommentDTO commentDTO) {
        Member currentMember = memberRepository.findByEmail(commentDTO.getEmail())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        Comment comment = commentDTO.toEntity(commentDTO);
        Comment savedComment = commentRepository.save(comment);

        return savedComment.getCno();
    }

    @Override
    public Comment getCommentDtl(Long cno) {
        Comment comment = commentRepository.findByCno(cno)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 댓글입니다."));

        return comment;
    }


    @Override
    public List<CommentDTO> getComments(Long bno) {
        List<Comment> commentList = commentRepository.findCommentList(bno);
        List<CommentDTO> commentDTOList = new ArrayList<>();

        for (Comment comment : commentList) {
            CommentDTO commentDTO = comment.toDTO(comment);
            commentDTOList.add(commentDTO);
        }

        return commentDTOList;
    }
}
