package com.guidewire.itv.controller;

import com.guidewire.itv.dto.PortfolioAnalyticsDto;
import com.guidewire.itv.service.PortfolioAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Portfolio Analytics", description = "Live database-backed KPI metrics, ITV distributions, and resolution statistics")
public class AnalyticsController {

    private final PortfolioAnalyticsService analyticsService;

    public AnalyticsController(PortfolioAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/portfolio")
    @Operation(summary = "Get live portfolio analytics including ITV classification counts, total gap, and resolution rate")
    public ResponseEntity<PortfolioAnalyticsDto> getPortfolioAnalytics() {
        PortfolioAnalyticsDto analytics = analyticsService.getPortfolioAnalytics();
        return ResponseEntity.ok(analytics);
    }
}

