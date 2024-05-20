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
@TableName("text")
public class Text {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;
    private Integer documentId;
    private Integer parentTitleId;
    private String content;
}
