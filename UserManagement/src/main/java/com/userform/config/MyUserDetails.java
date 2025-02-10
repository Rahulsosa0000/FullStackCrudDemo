package com.userform.config;

import java.util.Arrays;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.userform.model.Users;



/*
 * The UserDetails interface in Spring Security represents the core information about a user,
 *  such as username, password, and roles, which is needed for authentication and authorization.
 *  
 *  SimpleGrantedAuthority in Spring Security is a class that represents
 *   a user's role or permission (like "ROLE_ADMIN" or "ROLE_USER") in a simple and straightforward way. 
 *  It helps define what actions the user is allowed to perform in the application.
 *  
 */

public class MyUserDetails implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MyUserDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	private Users users;

	public MyUserDetails(Users users) {
		this.users = users;
	}
	
    public Long getId() {   
        return users.getId();
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		SimpleGrantedAuthority authority = new SimpleGrantedAuthority("USER");
		return Arrays.asList(authority);
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return users.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return users.getUsername();
	}
	

}
