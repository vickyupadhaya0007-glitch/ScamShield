
package com.scamshield.scamshield;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to ScamShield! Your backend is working.";
    }
}