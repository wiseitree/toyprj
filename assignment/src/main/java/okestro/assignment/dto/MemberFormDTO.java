package okestro.assignment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberFormDTO {

    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$", message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}",
    message = "비밀번호는 영문 대,소문자와 숫자 그리고 특수기호는 적어도 1개 이상 포함된 8자 ~ 16자의 비밀번호여야 합니다.")
    private String pw;

    @NotBlank( message = "닉네임은 공백문자를 포함할 수 없습니다.")
    @Size(min = 4, max = 12, message = "닉네임은 4자 이상 12자 이하여야 합니다.")
    private String nickname;

}
