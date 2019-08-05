package com.ggkttd.kolmakov.testSystem.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Controller
public class HomeController {

    @GetMapping("/error")
    public String greeting() {
        throw new RuntimeException("Test exception");
    }
}
