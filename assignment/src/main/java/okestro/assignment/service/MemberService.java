package okestro.assignment.service;

import okestro.assignment.dto.MemberDTO;
import okestro.assignment.dto.MemberFormDTO;
import org.springframework.web.bind.annotation.RequestHeader;

public interface MemberService {

    String register(MemberFormDTO memberFormDTO);

    boolean checkDuplicate(String currentData);


}
