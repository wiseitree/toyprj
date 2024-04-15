package okestro.assignment.repository;

import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Member;
import okestro.assignment.domain.MemberRole;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertMember() {
        //given
        //when
        for (int i = 1; i <= 10; i++) {
            Member member = Member.builder()
                    .email("user" + i + "@aaa.com")
                    .pw(passwordEncoder.encode("1111"))
                    .nickname("user" + i)
                    .build();

            member.addRole(MemberRole.USER);

            if (i >= 5)
                member.addRole(MemberRole.MANAGER);

            if (i >= 8)
                member.addRole(MemberRole.ADMIN);

            memberRepository.save(member);
        }
    }

    @Test()
    public void read(){
        //given
        String email = "user9@aaa.com";

        //when
        Optional<Member> result = memberRepository.findByEmail(email);
        Member member = result.get();

        log.info("member = {}", member);
        log.info("memberRoleSize = {} ", member.getMemberRoleList().size());

        //then
        assertThat(member.getMemberRoleList().size()).isEqualTo(3);

    }

    @Test
    public void delete() {
        //given
        //when
        for (int i = 1; i <= 10; i++) {
            memberRepository.deleteByEmail("user" + i + "@aaa.com");
        }

    }

    @Test
    public void findByNickname()  {
        //given
        String nickname = "user1";

        //when
        Member member = memberRepository.findByNickname(nickname).get();

        //then
        assertThat(member.getNickname()).isEqualTo(nickname);

    }


}