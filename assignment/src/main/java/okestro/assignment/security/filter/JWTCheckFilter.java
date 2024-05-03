package okestro.assignment.security.filter;

import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import okestro.assignment.dto.MemberDTO;
import okestro.assignment.util.JWTUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@Slf4j
public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        if (request.getMethod().equals("OPTIONS"))
            return true;

        String path = request.getRequestURI();
        log.info("check uri..........{}", path);


        if (path.startsWith("/api/member/")) {
            log.info("current uri ..........{}", path);
            return true;
        }

        if (path.startsWith("/api/board/list")){
            log.info("current uri ..........{}", path);
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("------------------------------JWTCheckFilter..........");

        String authHeaderStr = request.getHeader("Authorization");
        log.info("authHeaderStr={}", authHeaderStr);

        try {
            //Bearer accesstoken
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);

            log.info("JWT claims: " + claims);
            //filterChain.doFilter(request, response);
            String email = (String) claims.get("email");
            String pw = (String) claims.get("pw");
            String nickname = (String) claims.get("nickname");
            Boolean social = (Boolean) claims.get("social");
            List<String> roleNames = (List<String>) claims.get("roleNames");

            MemberDTO memberDTO = new MemberDTO(email, pw, nickname, social.booleanValue(), roleNames);

            log.info("------------------------------");
            log.info("memberDTO = {}", memberDTO);
            log.info("memberDTO.getAuthorities() = {}", memberDTO.getAuthorities());

            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

            SecurityContextHolder.getContext()
                    .setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("JWT Check Error..........");
            log.error(e.getMessage());

            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();

        }
    }

}
