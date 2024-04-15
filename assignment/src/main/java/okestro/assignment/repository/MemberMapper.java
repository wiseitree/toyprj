package okestro.assignment.repository;

import okestro.assignment.domain.Member;
import org.apache.ibatis.annotations.Mapper;

import javax.swing.text.html.Option;
import java.util.Optional;

@Mapper
public interface MemberMapper {

    void saveMember(Member member);
    void saveMemberRole(Member member);
    Optional<Member> findByEmail(String email);
    void deleteByEmail(String email);

    Optional<Member> findByNickname(String nickname);

}
