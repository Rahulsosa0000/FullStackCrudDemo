package com.userform.repo;


import org.springframework.data.jpa.repository.JpaRepository;

import com.userform.model.UserForm;

public interface FormRepo extends JpaRepository<UserForm, Long> {
	
	
}
