package com.example.app.image;


import com.example.main.ConfigurationBeans;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.PreparedStatement;

@Controller
@RequestMapping(value = "/")
public class ImageController {

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/image", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> Image(@RequestParam("thefile")MultipartFile p_file) throws IOException {
        return ResponseEntity.ok(ImageQuery.PostImage(p_file.getBytes()));
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/image", method = RequestMethod.GET, produces =  MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody
    byte[] ImageGet(@RequestParam("image_id") long p_id) {
        return ImageQuery.GetImage(p_id).data;
    }

}

