package com.example.app.image;

import com.example.main.ConfigurationBeans;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;

public class ImageQuery {
    public static ImageCreated PostImage(byte[] p_image, String p_format)
    {
        KeyHolder l_keyHolder = new GeneratedKeyHolder();
        ConfigurationBeans.jdbcTemplate.update(con -> {
            PreparedStatement l_ps = con.prepareStatement("insert into static_images(format, data) values (?, ?)");
            l_ps.setString(1, p_format);
            l_ps.setBytes(2, p_image);
            return l_ps;
        }, l_keyHolder);
        ImageCreated l_imageCreated = new ImageCreated();
        l_imageCreated.image_id = l_keyHolder.getKey().longValue();
        return l_imageCreated;
    }

    public static StaticImage GetImage(long p_imageId)
    {
        StaticImage l_image = new StaticImage();
        ConfigurationBeans.jdbcTemplate.query(con -> {
            PreparedStatement l_ps = con.prepareStatement("select * from static_images where static_images.id == ? limit 1");
            l_ps.setLong(1, p_imageId);
            return l_ps;
        },rs->{
            l_image.image_id = rs.getLong(1);
            l_image.format = rs.getString(2);
            l_image.data = rs.getBytes(3);
        });
        return l_image;
    }
}


class ImageCreated
{
    public long image_id;
}

class StaticImage
{
    public long image_id;
    public String format;
    public byte[] data;
}