//package com.example.plangenback.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.Ordered;
//import org.springframework.core.annotation.Order;
//import org.springframework.web.filter.CorsFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import javax.servlet.FilterChain;
//import javax.servlet.FilterConfig;
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.util.logging.Filter;
//
//@Configuration
//@Order(Ordered.HIGHEST_PRECEDENCE)
//public class MyCorsFilter implements Filter {
////    @Bean
////    public CorsFilter corsFilter() {
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        CorsConfiguration config = new CorsConfiguration();
////        config.setAllowCredentials(true);
////        config.addAllowedOrigin("*");
////        config.addAllowedHeader("*");
////        config.addAllowedMethod("*");
////        source.registerCorsConfiguration("/**", config);
////        return new CorsFilter(source);
////    }
//
//    @Override
//    public void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
//            throws IOException, ServletException {
//        res.addHeader("Access-Control-Allow-Origin", "*");
//        res.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//        res.addHeader("Access-Control-Allow-Headers", "Content-Type");
//
//        // Allow preflight requests to pass through without authentication
//        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
//            res.setStatus(HttpServletResponse.SC_OK);
//        } else {
//            chain.doFilter(req, res);
//        }
//    }
//
//    @Override
//    public void init(FilterConfig filterConfig) throws ServletException {
//        // No initialization needed
//    }
//
//    @Override
//    public void destroy() {
//        // No cleanup needed
//    }
//}
