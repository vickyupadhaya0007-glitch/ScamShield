
package com.scamshield.scamshield;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.PrePersist;
import java.time.LocalDateTime;

@Entity
@Table(name = "scam_reports")
public class ScamReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String url;

    @Column(nullable = false, length = 1000)
    private String description;

    private LocalDateTime reportedAt;

    public ScamReport() {
    }

    public ScamReport(String url, String description) {
        this.url = url;
        this.description = description;
    }

    @PrePersist
    public void setReportedAt() {
        if (reportedAt == null) {
            reportedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }
}