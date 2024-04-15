package okestro.assignment.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.domain.Member;
import okestro.assignment.dto.MemberDTO;
import okestro.assignment.dto.MemberFormDTO;
import okestro.assignment.exception.CustomInvalidDataException;
import okestro.assignment.repository.MemberRepository;
import okestro.assignment.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;

    @PreAuthorize("permitAll()")
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody MemberFormDTO memberFormDTO, BindingResult bindingResult) {
        Map<String, String> result = new HashMap<>();

        if (bindingResult.hasErrors()) {
            result.put("result", "fail");
            return ResponseEntity.badRequest().body(result);
        }

        String email = memberService.register(memberFormDTO);
        result.put("result", "success");
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, String>> checkDuplicate(@RequestHeader("CurrentData") String currentData) {
        boolean isDuplicated = false;

        isDuplicated = memberService.checkDuplicate(currentData);


        Map<String, String> result = new HashMap<>();

        if (isDuplicated)
            result.put("result", "isDuplicated");
        else
            result.put("result", "isNotDuplicated");

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/")
    public Member getMember(@RequestHeader("CurrentData") String currentEmail) {
        HashMap<String, String> result = new HashMap<>();
        Member member = memberRepository.findByEmail(currentEmail).orElseThrow(() -> new NoSuchElementException("존재하지 않는 회원입니다."));

        return member;
    }

}

