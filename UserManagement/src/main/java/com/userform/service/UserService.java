package com.userform.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.userform.model.Users;
import com.userform.repo.UsersRepo;

@Service
public class UserService {

    private final UsersRepo userRepository;

    public UserService(UsersRepo userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<Users> findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }
}
