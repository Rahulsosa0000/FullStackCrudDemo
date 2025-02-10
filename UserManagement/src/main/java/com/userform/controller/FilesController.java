//package com.userform.controller;
//
//
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import java.io.*;
//import java.nio.file.*;
//import java.util.zip.ZipEntry;
//import java.util.zip.ZipInputStream;
//
//@RestController
//@RequestMapping("/api/files")
//@CrossOrigin(origins = "http://localhost:4200")
//public class FilesController {
//
//    private static final String UPLOAD_DIR = "D:/uploaded_files/";
//
//    @PostMapping("/upload")
//    public String uploadFile(@RequestParam("file") MultipartFile file) {
//        if (file.isEmpty()) {
//            return "File is empty!";
//        }
//
//        try {
//            // Ensure directory exists
//            Files.createDirectories(Paths.get(UPLOAD_DIR));
//
//            // Save ZIP file
//            Path filePath = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
//            Files.write(filePath, file.getBytes());
//
//            // Unzip the file
//            unzipFile(filePath.toString(), UPLOAD_DIR);
//
//            return "File uploaded and extracted successfully!";
//        } catch (IOException e) {
//            return "Error uploading file: " + e.getMessage();
//        }
//    }
//
//    private void unzipFile(String zipFilePath, String destDir) throws IOException {
//        File destFile = new File(destDir);
//        if (!destFile.exists()) {
//            destFile.mkdirs();
//        }
//
//        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath))) {
//            ZipEntry entry;
//            while ((entry = zipIn.getNextEntry()) != null) {
//                File outFile = new File(destDir, entry.getName());
//                if (entry.isDirectory()) {
//                    outFile.mkdirs();
//                } else {
//                    try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(outFile))) {
//                        byte[] buffer = new byte[1024];
//                        int len;
//                        while ((len = zipIn.read(buffer)) > 0) {
//                            bos.write(buffer, 0, len);
//                        }
//                    }
//                }
//                zipIn.closeEntry();
//            }
//        }
//    }
//} 

package com.userform.controller;

import com.userform.model.UserForm;
import com.userform.repo.FormRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:4200")
public class FilesController {

    private static final String UPLOAD_DIR = "D:/uploaded_files/";

    @Autowired
    private FormRepo userFormRepository;  // Inject Repository

    @PostMapping("/upload")
    public String uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("phone") String phone,
            @RequestParam("dob") String dob,
            @RequestParam("gender") String gender,
            @RequestParam("address") String address,
            @RequestParam("userType") String userType) {

        if (file.isEmpty()) {
            return "File is empty!";
        }

        try {
            // Ensure directory exists
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Save ZIP file
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename(); // Unique filename
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());

            // Unzip the file
            String extractPath = UPLOAD_DIR + "extracted_" + System.currentTimeMillis() + "/";
            unzipFile(filePath.toString(), extractPath);

            // Save form data in DB
            UserForm userForm = new UserForm();
            userForm.setName(name);
            userForm.setEmail(email);
            userForm.setPassword(password);
            userForm.setPhone(phone);
            userForm.setDob(LocalDate.parse(dob));
            userForm.setGender(gender);
            userForm.setAddress(address);
            userForm.setUserType(userType);
            userForm.setZipfile(fileName.toString()); // Save filename in DB

            userFormRepository.save(userForm);  // Save user form in DB

            return "User data and ZIP file saved successfully!";
        } catch (IOException e) {
            return "Error uploading file: " + e.getMessage();
        }
    }

    private void unzipFile(String zipFilePath, String destDir) throws IOException {
        File destFile = new File(destDir);
        if (!destFile.exists()) {
            destFile.mkdirs();
        }

        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry entry;
            while ((entry = zipIn.getNextEntry()) != null) {
                File outFile = new File(destDir, entry.getName());
                if (entry.isDirectory()) {
                    outFile.mkdirs();
                } else {
                    try (BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(outFile))) {
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zipIn.read(buffer)) > 0) {
                            bos.write(buffer, 0, len);
                        }
                    }
                }
                zipIn.closeEntry();
            }
        }
    }
}

