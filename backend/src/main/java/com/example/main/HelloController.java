package com.example.main;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/test")
public class HelloController {

	@GetMapping
	public @ResponseBody String getTestDate() 
	{
		ConfigurationBeans.jdbcTemplate.execute("HELLOZZD");
		return "Greetings from Spring Boot!";
	}
}

