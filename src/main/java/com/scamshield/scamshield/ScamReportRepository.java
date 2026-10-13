
package com.scamshield.scamshield;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ScamReportRepository
        extends JpaRepository<ScamReport, Long> {
}