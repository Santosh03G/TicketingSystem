package com.ticketingsystem.service;

import com.ticketingsystem.model.User;
import com.ticketingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        // Return or use EmailService to send this OTP
        // For now, we will assume the Controller calls EmailService using the OTP from
        // the user entity if needed,
        // or we can inject EmailService here.
        // To keep UserService clean, let's just save it. The controller will retrieve
        // it to send via email.
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
        try (org.apache.poi.ss.usermodel.Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(
                file.getInputStream())) {
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
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
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
