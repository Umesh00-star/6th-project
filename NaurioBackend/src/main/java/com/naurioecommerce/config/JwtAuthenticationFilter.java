package com.naurioecommerce.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import com.naurioecommerce.service.CustomUserDetailsService;
import com.naurioecommerce.service.ShopUserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.authentication.AuthenticationProvider;


import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ShopUserDetailsService shopUserDetailsService;
    


   @Override
protected void doFilterInternal(@NonNull HttpServletRequest request,
                                @NonNull HttpServletResponse response,
                               @NonNull FilterChain filterChain)
        throws ServletException, IOException {

    String path = request.getServletPath();

    // ✅ SKIP filter for login and register endpoints
    if (path.startsWith("/api/auth")) {
        filterChain.doFilter(request, response);
        return;
    }

    String header = request.getHeader("Authorization");

    if (header != null && header.startsWith("Bearer ")) {
        String token = header.substring(7);
        if (jwtTokenProvider.validateToken(token)) {
            String username = jwtTokenProvider.getUsernameFromToken(token);
             String userType = jwtTokenProvider.getUserTypeFromToken(token);



        //     UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        //     UsernamePasswordAuthenticationToken authentication =
        //             new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        //     authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        //     SecurityContextHolder.getContext().setAuthentication(authentication);
        // }

         UserDetails userDetails;

        // if ("shop".equalsIgnoreCase(userType)) {
        //     userDetails = shopUserDetailsService.loadUserByUsername(username);
        // } else {
        //     userDetails = customUserDetailsService.loadUserByUsername(username);
        // }

        if ("shop".equalsIgnoreCase(userType)) {
    userDetails = shopUserDetailsService.loadUserByUsername(username);
} else if ("user".equalsIgnoreCase(userType)) {
    userDetails = customUserDetailsService.loadUserByUsername(username);
} else {
    throw new UsernameNotFoundException("Invalid user type in token");
}

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    }

    filterChain.doFilter(request, response);
}

    
}
