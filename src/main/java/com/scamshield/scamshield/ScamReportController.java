
package com.scamshield.scamshield;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ScamReportController {

    private final ScamReportRepository repository;

    public ScamReportController(ScamReportRepository repository) {
        this.repository = repository;
    }

    // Submit a new scam report
    @PostMapping
    public ResponseEntity<ScamReport> createReport(
            @RequestBody ScamReport report) {

        if (report.getUrl() == null || report.getUrl().isBlank()
                || report.getDescription() == null
                || report.getDescription().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        report.setUrl(report.getUrl().trim());
        report.setDescription(report.getDescription().trim());

        ScamReport savedReport = repository.save(report);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
    }

    // Retrieve all scam reports
    @GetMapping
    public List<ScamReport> getAllReports() {
        return repository.findAll();
    }
}