package okestro.assignment.repository;


import lombok.RequiredArgsConstructor;
import okestro.assignment.domain.Member;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MemberRepository {

    private final MemberMapper memberMapper;

    public Member save(Member member){
        memberMapper.saveMember(member);
        memberMapper.saveMemberRole(member);
        return member;
    }

    public Optional<Member> findByEmail(String email) {
        return memberMapper.findByEmail(email);
    }

    public void deleteByEmail(String email){
        memberMapper.deleteByEmail(email);
    }

    public Optional<Member> findByNickname(String nickname){
        return memberMapper.findByNickname(nickname);
    }



}
