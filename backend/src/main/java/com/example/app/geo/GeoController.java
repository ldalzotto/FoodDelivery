package com.example.app.geo;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/")
public class GeoController {
    @CrossOrigin(origins = "http://localhost:8081")
    @RequestMapping(value = "/city/match", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<?> GetAllCitiesMatching(
            @RequestParam("matchValue") String p_matchValue,
            @RequestParam("limit") long p_limit) {
        return ResponseEntity.ok().body(GeoService.GetAllCitiesMatching(p_matchValue, p_limit));
    }

}
