package com.guidewire.itv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ItvApplication {
    public static void main(String[] args) {
        SpringApplication.run(ItvApplication.class, args);
    }
}
