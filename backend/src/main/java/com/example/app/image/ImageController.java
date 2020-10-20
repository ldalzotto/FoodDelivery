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
    /*
    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/image", method = RequestMethod.POST)
    public @ResponseBody
    ResponseEntity<?> Image(@RequestParam("thefile")MultipartFile p_file,
                            @RequestParam("type") String p_type) {
        KeyHolder l_keyHolder = new GeneratedKeyHolder();
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into static_images(format, data) values (?, ?)");
            l_ps.setString(1, p_type);
            try {
                l_ps.setBytes(2, p_file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
            return l_ps;
        }, l_keyHolder);
        ImageCreated l_imageCreated = new ImageCreated();
        l_imageCreated.image_id = l_keyHolder.getKey().longValue();
        return ResponseEntity.ok(l_imageCreated);
    }

    @CrossOrigin(origins = {"http://localhost:8081", "http://192.168.1.11:8081"})
    @RequestMapping(value = "/image", method = RequestMethod.GET, produces =  MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody
    byte[] ImageGet(@RequestParam("id") long p_id) {
        ImageByteWrapper l_image = new ImageByteWrapper();
        ConfigurationBeans.jdbcTemplate.query(con -> {
            PreparedStatement l_ps = con.prepareStatement("select * from static_images where static_images.id == ? limit 1");
            l_ps.setLong(1, p_id);
            return l_ps;
        },rs->{
            l_image.image = rs.getBytes(3);
        });
        return l_image.image;
    }
    */
}

class ImageByteWrapper
{
    public byte[] image;
}


