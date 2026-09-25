```java
package backend.controller;

import backend.entity.Registration;
import backend.repository.RegistrationRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "https://campus-connect-dusky-tau.vercel.app")
public class RegistrationController {

    private final RegistrationRepository registrationRepository;

    public RegistrationController(RegistrationRepository registrationRepository) {
        this.registrationRepository = registrationRepository;
    }

    @PostMapping
    public Registration register(@RequestBody Registration registration) {
        return registrationRepository.save(registration);
    }

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    @GetMapping("/user")
    public List<Registration> getUserRegistrations(
            @RequestParam String email) {
        return registrationRepository.findByEmail(email);
    }
}
```
