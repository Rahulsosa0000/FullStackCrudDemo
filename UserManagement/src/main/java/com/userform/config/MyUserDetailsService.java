package com.userform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.userform.model.Users;
import com.userform.repo.UsersRepo;



/*UserDetailsService in Spring Security is an interface used to fetch user information 
 * (like username, password, and roles) from a database or another source. 
 * It is used during the authentication process to verify and load user details. 
 */

@Service // This is essential to mark this as a Spring-managed bean
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	private UsersRepo repo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    Users user = repo.findByUsername(username);
	    if (user == null) {
	        throw new UsernameNotFoundException("User not found with username: " + username);
	    }
	    return new MyUserDetails(user);  // Wrap user in MyUserDetails
	}

 
}
