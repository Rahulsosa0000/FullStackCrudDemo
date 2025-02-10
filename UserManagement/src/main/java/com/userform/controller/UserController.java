package com.userform.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userform.config.MyUserDetails;
import com.userform.model.UserToken;
import com.userform.service.JwtService;
import com.userform.service.RefreshTokenService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

//	@Autowired
//	private AuthenticationManager authenticationManager;
//
//	@Autowired
//	private JwtService jwtUtils;
//	@Autowired
//	private MyUserDetailsService userDetailsService;

//	@PostMapping("/login")
	
	// this is my main
	
//	public ResponseEntity<?> loginUser(@RequestBody Users loginRequest) {
//		try {
//			Authentication authentication = authenticationManager.authenticate(
//					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//			MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
//			String jwt = jwtUtils.generateToken(userDetails);
//
//			return ResponseEntity.ok(Map.of("jwtToken", jwt));
//		} catch (AuthenticationException e) {
//			return ResponseEntity.status(401).body("Invalid username or password");
//		}
//	}
	
	
	
//	@PostMapping("/login")
//	public ResponseEntity<?> loginUser(@RequestBody Users loginRequest) {
//	    try {
//	        Authentication authentication = authenticationManager.authenticate(
//	                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//	        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
//	        
//	        // ✅ Generate Access & Refresh Tokens
//	        String jwt = jwtUtils.generateToken(userDetails);
//	        String refreshToken = jwtUtils.generateToken(userDetails);
//
//	        return ResponseEntity.ok(Map.of(
//	                "jwtToken", jwt,
//	                "refreshToken", refreshToken
//	        ));
//	    } catch (AuthenticationException e) {
//	        return ResponseEntity.status(401).body("Invalid username or password");
//	    }
//	}
//	
//	@PostMapping("/refresh")
//    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
//        String refreshToken = request.get("refreshToken");
//        
//        if (refreshToken == null || jwtUtils.isTokenExpired(refreshToken)) {
//            return ResponseEntity.status(401).body("Invalid or expired refresh token");
//        }
//
//        // ✅ Get username from refresh token
//        String username = jwtUtils.extractUserName(refreshToken);
//        
//        // ✅ Fetch user from DB
//        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//
//        // ✅ Generate new access token
//        String newAccessToken = jwtUtils.generateToken(userDetails);
//
//        return ResponseEntity.ok(Map.of("jwtToken", newAccessToken));
//    }


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtUtils;

    @Autowired
    private RefreshTokenService userTokenService;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.get("username"), loginRequest.get("password")));  //Checks if the user exists in the database.


            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();//Retrieves the authenticated user’s details

            // Generate Access & Refresh Tokens
            String accessToken = jwtUtils.generateToken(userDetails);
            String refreshToken = jwtUtils.generateRefreshToken(userDetails);
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(30); 
            
            System.out.println("Access Token: " + accessToken);
            System.out.println("Refresh Token: " + refreshToken);


            //  Save tokens in DB
            userTokenService.saveUserToken(userDetails.getId(), accessToken, refreshToken, expiryTime);

            return ResponseEntity.ok(Map.of( //The frontend (Angular) will store these tokens and use them for authentication in future requests
                    "jwtToken", accessToken,
                    "refreshToken", refreshToken
            )); 
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
    
    

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        System.out.println("Saving Refresh Token: " + refreshToken); // Debugging ke liye


        //  Find refresh token in DB
        Optional<UserToken> storedToken = userTokenService.findByRefreshToken(refreshToken);
        if (storedToken.isEmpty() || storedToken.get().getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(401).body("Invalid or expired refresh token");
        }

        //  Generate new access token
        String username = storedToken.get().getUserId().toString();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String newAccessToken = jwtUtils.generateToken(userDetails);

        return ResponseEntity.ok(Map.of("jwtToken", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        userTokenService.deleteTokenByUserId(Long.parseLong(userId));
        return ResponseEntity.ok("Logged out successfully");
    }
	

}
