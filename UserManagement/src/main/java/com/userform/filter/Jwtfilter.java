package com.userform.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.userform.config.MyUserDetailsService;
import com.userform.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class Jwtfilter extends OncePerRequestFilter {

	@Autowired
	private JwtService jwtService;

	@Autowired
	private MyUserDetailsService userService;

	@Autowired
	ApplicationContext context;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		final String authorizationHeader = request.getHeader("Authorization");

		System.out.println("Authorization Header: " + authorizationHeader); // <-- Add this line

		String username = null;
		String token = null;

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
			token = authorizationHeader.substring(7);
			username = jwtService.extractUserName(token);
			System.out.println("Extracted Username: " + username); // Log it

		}

//	        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//	            UserDetails userDetails = userService.loadUserByUsername(username);
//
//	            if (jwtService.validateToken(jwt, userDetails)) {
//	                var usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
//	                        userDetails, null, userDetails.getAuthorities());
//	                usernamePasswordAuthenticationToken.setDetails(
//	                        new WebAuthenticationDetailsSource().buildDetails(request));
//	                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
//	            }
//	        }

		// if username not null and context is null so set authentication
		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

			// fetch user detail from username
			UserDetails userDetails = this.userService.loadUserByUsername(username);
			// logger.info(" userDetails : {}", userDetails.toString()); // UserName,
			// password

			Boolean validateToken = this.jwtService.validateToken(token, userDetails);// to tell the helper check user
																						// or token
			if (validateToken) {

				// set the authentication
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());
				// authentication.setDetails(new
				// WebAuthenticationDetailsSource().buildDetails(request)); //
				// WebAuthenticationDetailsSource contain IP address from which the HTTP request
				// or session id
				SecurityContextHolder.getContext().setAuthentication(authentication);

				// logger.info(" authentication : {}", authentication); // information about
				// SetDetails request

			}

		}

		filterChain.doFilter(request, response);
	}

}