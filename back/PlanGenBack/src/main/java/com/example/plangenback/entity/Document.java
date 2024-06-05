package com.example.plangenback.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("document")
public class Document {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private String mainTitle;
    private String city;
    private String disaster;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateTime;

    public Document(String mainTitle, String city, String disaster, LocalDateTime updateTime) {
        this.mainTitle = mainTitle;
        this.city = city;
        this.disaster = disaster;
        this.updateTime = updateTime;
    }
}
