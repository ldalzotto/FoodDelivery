package com.example.app.image.domain;

public class ImageUrl {
    public long image_id;
    public String url;

    public ImageUrl(long p_imageId)
    {
        this.image_id = p_imageId;
        this.url = String.format("http://localhost:8080/image?image_id=%d", this.image_id);
    }
}
