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

    @Autowired
    private EmailService emailService;

    public List<User> getAllUsers() {
        return userRepository.findByIsDeletedFalse();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            if (!existing.get().isDeleted()) {
                throw new RuntimeException("Email already exists");
            } else {
                // It's a deleted user, rename it to free up the email
                User deletedUser = existing.get();
                deletedUser.setEmail(deletedUser.getEmail() + "_reclaimed_" + System.currentTimeMillis());
                userRepository.save(deletedUser);
            }
        }
        // Generate random password
        String tempPassword = generateRandomPassword();
        user.setPassword(tempPassword); // In real app, hash this!
        user.setNew(true);

        User savedUser = userRepository.save(user);

        // Send welcome email
        String subject = "Welcome to the Ticketing System - Action Required";
        String body = "Hello " + user.getName() + ",\n\n" +
                "Welcome to the Ticketing System! Your account has been created.\n\n" +
                "Your Temporary Password: " + tempPassword + "\n\n" +
                "Please login with this password. You will be required to set a new password immediately.\n\n" +
                "Best Regards,\nTicketing System Team";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

        return savedUser;
    }

    public void setupPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword); // Hash in real app
        user.setNew(false);
        userRepository.save(user);
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
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
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setDeleted(true);
        // Append timestamp to email to allow reuse of the original email
        user.setEmail(user.getEmail() + "_deleted_" + System.currentTimeMillis());
        userRepository.save(user);
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
