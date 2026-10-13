
package com.scamshield.scamshield;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UrlCheckController {

    @GetMapping("/api/check-url")
    public UrlResult checkUrl(@RequestParam String url) {

        List<String> warnings = new ArrayList<>();
        int score = 0;

        String value = url.trim().toLowerCase(Locale.ROOT);

        if (value.isEmpty()) {
            return new UrlResult(
                "INVALID", 0, List.of("Please enter a URL.")
            );
        }

        try {
            URI uri = URI.create(value);

            if (!"http".equals(uri.getScheme())
                    && !"https".equals(uri.getScheme())) {
                return new UrlResult(
                    "INVALID", 0,
                    List.of("URL must start with http:// or https://.")
                );
            }

            String host = uri.getHost();

            if (host == null || host.isBlank()) {
                return new UrlResult(
                    "INVALID", 0,
                    List.of("Please enter a valid website URL.")
                );
            }

            if (host.startsWith("xn--")
                    || host.contains(".xn--")) {
                score += 25;
                warnings.add("Domain contains encoded international characters.");
            }

            if (host.matches("\\d{1,3}(\\.\\d{1,3}){3}")) {
                score += 25;
                warnings.add("URL uses an IP address instead of a domain name.");
            }

            if (host.split("\\.").length >= 5) {
                score += 15;
                warnings.add("Domain contains many subdomains.");
            }

            if (value.contains("@")) {
                score += 20;
                warnings.add("URL contains an @ symbol that may confuse users.");
            }

            String[] suspiciousWords = {
                "verify", "login", "secure", "update",
                "wallet", "free", "gift", "claim"
            };

            for (String word : suspiciousWords) {
                if (host.contains(word)) {
                    score += 10;
                    warnings.add("Domain contains a potentially suspicious word: " + word);
                }
            }

        } catch (IllegalArgumentException e) {
            return new UrlResult(
                "INVALID", 0,
                List.of("Please enter a valid URL.")
            );
        }

        score = Math.min(score, 100);

        String riskLevel;
        if (score >= 50) {
            riskLevel = "HIGH";
        } else if (score >= 20) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        if (warnings.isEmpty()) {
            warnings.add("No suspicious patterns were detected by these basic rules.");
        }

        return new UrlResult(riskLevel, score, warnings);
    }

    public record UrlResult(
        String riskLevel,
        int score,
        List<String> warnings
    ) {}
}