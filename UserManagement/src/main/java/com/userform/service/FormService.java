package com.userform.service;

import com.userform.model.UserForm;
import com.userform.repo.FormRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FormService {

    @Autowired
    private FormRepo userFormRepository;

    public UserForm saveUser(UserForm user) {
        return userFormRepository.save(user);
    }

    public List<UserForm> getAllUsers() {
        return userFormRepository.findAll();
    }

    public Optional<UserForm> getUserById(Long id) {
        return userFormRepository.findById(id);
    }

    public UserForm updateUser(Long id, UserForm userDetails) {
        Optional<UserForm> optionalUser = userFormRepository.findById(id);
        if (optionalUser.isPresent()) {
            UserForm user = optionalUser.get();
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setPhone(userDetails.getPhone());
            user.setDob(userDetails.getDob());
            user.setGender(userDetails.getGender());
            user.setAddress(userDetails.getAddress());
            user.setUserType(userDetails.getUserType());
            return userFormRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

    public void deleteUser(Long id) {
        userFormRepository.deleteById(id);
    }
}
