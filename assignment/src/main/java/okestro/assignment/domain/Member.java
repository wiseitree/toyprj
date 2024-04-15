package okestro.assignment.domain;


import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    private String email;
    private String pw;
    private String nickname;
    private boolean social;
    private List<MemberRole> memberRoleList;

    @Builder
    public Member(String email, String pw, String nickname){
        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.memberRoleList = new ArrayList<>();
    }

    public void addRole(MemberRole memberRole){
        memberRoleList.add(memberRole);
    }

}
