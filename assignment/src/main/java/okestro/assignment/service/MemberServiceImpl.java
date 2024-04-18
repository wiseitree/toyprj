package okestro.assignment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Member;
import okestro.assignment.domain.MemberRole;
import okestro.assignment.dto.MemberDTO;
import okestro.assignment.dto.MemberFormDTO;
import okestro.assignment.exception.CustomInvalidDataException;
import okestro.assignment.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String register(MemberFormDTO memberFormDTO) {
        Member member = createMember(memberFormDTO);
        Member savedMember = memberRepository.save(member);
        String email = savedMember.getEmail();
        return email;
    }

    @Override
    public boolean checkDuplicate(String currentData) {
        boolean isDuplicated = false;

        String[] splitData = currentData.split(":");

        if (splitData.length != 2)
            throw new CustomInvalidDataException("유효하지 않은 값을 입력하셨습니다.");

        isDuplicated = checkData(splitData);

        return isDuplicated;
    }

    private Member createMember(MemberFormDTO memberFormDTO) {
        Member member = Member.builder()
                .email(memberFormDTO.getEmail())
                .pw(passwordEncoder.encode(memberFormDTO.getPw()))
                .nickname(memberFormDTO.getNickname())
                .build();

        member.addRole(MemberRole.ADMIN);

        return member;
    }

    public boolean checkData(String[] splitData){
        String type = splitData[0];
        String data = splitData[1];
        boolean duplicated = false;
        Optional<Member> findMember = Optional.empty();

        if (type.equals("email"))
            findMember = memberRepository.findByEmail(data);

        if (type.equals("nickname"))
            findMember = memberRepository.findByNickname(data);

        if (findMember.isPresent())
            duplicated = true;

        return duplicated;
    }


}
