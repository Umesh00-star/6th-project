

package com.naurioecommerce.config;

import java.nio.file.Paths;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
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
   
                  registry.addResourceHandler("/shop")
                .addResourceLocations(frontendPath)
                .setCachePeriod(0); // Disable caching (for development)
   
   
    // Map uploaded product images
    registry.addResourceHandler("/api/product/images/**")
            .addResourceLocations("file:uploads/")
            .setCachePeriod(0); // Optional: disable caching for dev
   
    }

    

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//         public void addCorsMappings(@NonNull CorsRegistry registry) {
//             registry.addMapping("/api/**")
//             .allowedOrigins("http://localhost:3000")
//             .allowedMethods("GET", "POST", "PUT","DELETE","OPTIONS" )
//             .allowedHeaders("*")
//             .allowCredentials(true);
//         }
//     };
// }


 @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // Apply CORS to all endpoints including static resources
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

}
    
