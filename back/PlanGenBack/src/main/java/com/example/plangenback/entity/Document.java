package com.example.plangenback.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public Document(String mainTitle, String city, String disaster) {
        this.mainTitle = mainTitle;
        this.city = city;
        this.disaster = disaster;
    }
}
