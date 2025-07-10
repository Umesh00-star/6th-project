

package com.naurioecommerce.config;

import java.nio.file.Paths;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// import io.micrometer.common.lang.NonNull;

@Configuration
public class Webconfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Get the absolute path to the frontend index.html
        String frontendPath = Paths.get("../nauriofrontend/public/").toAbsolutePath().toUri().toString();

        registry.addResourceHandler("/")
                .addResourceLocations(frontendPath)
                .setCachePeriod(0); // Disable caching (for development)
    }

    

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
        public void addCorsMappings(@NonNull CorsRegistry registry) {
            registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT","DELETE","OPTIONS" )
            .allowedHeaders("*")
            .allowCredentials(true);
        }
    };
}

}
    
