```java
package backend.controller;

import backend.entity.User;
import backend.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(originPatterns = "https://*.vercel.app")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Map<String, String> loginUser(@RequestBody User user) {
        return userRepository.findByEmail(user.getEmail())
                .map(existingUser -> {
                    Map<String, String> response = new HashMap<>();

                    if (existingUser.getPassword().equals(user.getPassword())) {
                        response.put("message", "Login successful");
                        response.put("name", existingUser.getName());
                        response.put("email", existingUser.getEmail());
                    } else {
                        response.put("message", "Invalid password");
                    }

                    return response;
                })
                .orElseGet(() -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "User not found");
                    return response;
                });
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
            @RequestBody Map<String, String> request) {

        Map<String, String> response = new HashMap<>();

        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || newPassword == null
                || email.isBlank() || newPassword.isBlank()) {

            response.put("message", "Email and new password are required.");
            return response;
        }

        return userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setPassword(newPassword);
                    userRepository.save(existingUser);

                    response.put("message", "Password reset successfully.");
                    return response;
                })
                .orElseGet(() -> {
                    response.put("message",
                            "No account found with this email.");
                    return response;
                });
    }
}
```
