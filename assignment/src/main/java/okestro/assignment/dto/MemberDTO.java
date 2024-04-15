package okestro.assignment.dto;

import lombok.*;
import okestro.assignment.domain.Member;
import okestro.assignment.domain.MemberRole;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
public class MemberDTO extends User {

    private String email;
    private String pw;
    private String nickname;
    private boolean social;
    private List<String> roleNames = new ArrayList<>();



    public MemberDTO(String email, String pw, String nickname, boolean social, List<String> roleNames) {
        super(
                email,
                pw,
                roleNames.stream().map(str ->
                        new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList())
        );

        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.social = social;
        this.roleNames = roleNames;
    }

    public Map<String, Object> getClaims(){
        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickname", nickname);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }

    public Member toEntity(MemberDTO memberDTO, PasswordEncoder passwordEncoder){
        Member member = Member.builder()
                .email(memberDTO.getEmail())
                .pw(passwordEncoder.encode(memberDTO.getPw()))
                .nickname(memberDTO.getNickname())
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }

}
