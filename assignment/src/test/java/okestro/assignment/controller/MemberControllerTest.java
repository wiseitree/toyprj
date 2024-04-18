package okestro.assignment.controller;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Slf4j
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void checkDuplicate() throws Exception {
        //given
        String currentData = "nickname:ㅁㄴㅇㅂㅈㄷ";

        //when
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/api/member/check")
                                .header("CurrentData", currentData))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("isNotDuplicated"));
        //then
    }

}