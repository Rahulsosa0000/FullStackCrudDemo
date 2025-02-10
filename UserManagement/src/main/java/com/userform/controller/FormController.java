package com.userform.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userform.model.UserForm;
import com.userform.service.FormService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Angular ke liye CORS enable
public class FormController {
    
    @Autowired
    private FormService formService;

    //  Create User (POST)
    @PostMapping("/add")
    public UserForm createUser(@RequestBody UserForm user) {
        return formService.saveUser(user);
    }

    //  Get All Users (GET)
    @GetMapping("/all")
    public List<UserForm> getAllUsers() {
        return formService.getAllUsers();
    }

    //  Get User by ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<UserForm> getUserById(@PathVariable Long id) {
        return formService.getUserById(id)
            .map(user -> ResponseEntity.ok(user)) 
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //  Update User (PUT)
    @PutMapping("/update/{id}")
    public ResponseEntity<UserForm> updateUser(@PathVariable Long id, @RequestBody UserForm userDetails) {
        UserForm updatedUser = formService.updateUser(id, userDetails);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser); // Return updated user
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if user not found
        }
    }


    //  Delete User (DELETE)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        formService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }
 
    
}
