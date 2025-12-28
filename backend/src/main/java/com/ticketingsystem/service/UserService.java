package com.ticketingsystem.service;

import com.ticketingsystem.model.Role;
import com.ticketingsystem.model.User;
import com.ticketingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public void generateOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        user.setOtp(otp);
        user.setOtpExpirationTime(java.time.LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || user.getOtpExpirationTime() == null) {
            return false;
        }

        if (java.time.LocalDateTime.now().isAfter(user.getOtpExpirationTime())) {
            return false;
        }

        return user.getOtp().equals(otp);
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(newPassword);
        user.setOtp(null);
        user.setOtpExpirationTime(null);
        userRepository.save(user);
    }

    public void saveUsersFromExcel(org.springframework.web.multipart.MultipartFile file) {
        System.out.println("Receiving file: " + file.getOriginalFilename() + " Size: " + file.getSize());
        java.nio.file.Path tempFile = null;
        try {
            tempFile = java.nio.file.Files.createTempFile("upload", ".xlsx");
            file.transferTo(tempFile.toFile());

            try (org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(tempFile.toFile())) {
                org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
                List<User> users = new java.util.ArrayList<>();

                for (org.apache.poi.ss.usermodel.Row row : sheet) {
                    if (row.getRowNum() == 0)
                        continue; // Skip header

                    String name = getCellValue(row.getCell(0));
                    String email = getCellValue(row.getCell(1));
                    String password = getCellValue(row.getCell(2));
                    String roleStr = getCellValue(row.getCell(3));

                    if (name.isEmpty() || email.isEmpty() || password.isEmpty())
                        continue;

                    // Check if user already exists
                    if (userRepository.existsByEmail(email))
                        continue;

                    User user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    user.setPassword(password); // In a real app, hash this!

                    try {
                        user.setRole(Role.valueOf(roleStr.toUpperCase()));
                    } catch (IllegalArgumentException | NullPointerException e) {
                        user.setRole(Role.USER); // Default to USER
                    }

                    users.add(user);
                }
                userRepository.saveAll(users);
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log to console
            throw new RuntimeException("Import failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        } finally {
            // Clean up temp file
            if (tempFile != null) {
                try {
                    java.nio.file.Files.deleteIfExists(tempFile);
                } catch (java.io.IOException e) {
                    System.err.println("Failed to delete temp file: " + e.getMessage());
                }
            }
        }
    }

    private String getCellValue(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null)
            return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }
}
