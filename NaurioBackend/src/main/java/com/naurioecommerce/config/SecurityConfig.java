package com.naurioecommerce.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.naurioecommerce.service.CustomUserDetailsService;
import com.naurioecommerce.service.ShopUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

     @Autowired
    private ShopUserDetailsService shopUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @SuppressWarnings("deprecation")
    @Bean
    public DaoAuthenticationProvider AuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }


    @Bean
public DaoAuthenticationProvider shopAuthenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setUserDetailsService(shopUserDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}

    

//   @Bean
// public AuthenticationManager userAuthenticationManager(
//         CustomUserDetailsService customUserDetailsService,
//         PasswordEncoder passwordEncoder) {

//     DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//     provider.setUserDetailsService(customUserDetailsService);
//     provider.setPasswordEncoder(passwordEncoder);

//     return new ProviderManager(provider);
// }

// @Bean
// public AuthenticationManager shopAuthenticationManager(
//         ShopUserDetailsService shopUserDetailsService,
//         PasswordEncoder passwordEncoder) {

//     DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//     provider.setUserDetailsService(shopUserDetailsService);
//     provider.setPasswordEncoder(passwordEncoder);

//     return new ProviderManager(provider);
// }

 // Single AuthenticationManager combining both providers
    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(AuthenticationProvider(), shopAuthenticationProvider());
    }




 @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf->csrf.disable())
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**","/api/auth/register", "/**", "/shop/**", "/api/shop/**").permitAll() 
            .requestMatchers("/", "/index.html", "/static/**", "/css/**", "/js/**", "/images/**").permitAll()
             .requestMatchers("/register",  "/login", "/test","/home","/public/**").permitAll() // <-- Add your public pages here
            .anyRequest().authenticated()
           )
            .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(AuthenticationProvider())
            .authenticationProvider(shopAuthenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
