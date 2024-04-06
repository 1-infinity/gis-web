package com.example.plangenback.entity;

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
    @TableId
    private Integer id;
    private Integer parentTitleId;
    private String content;
}
